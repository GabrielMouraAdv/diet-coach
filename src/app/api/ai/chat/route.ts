import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { buildCoachSystemPrompt } from '@/lib/ai-context';
import { getSession } from '@/lib/auth';
import { findFoodsByNames } from '@/lib/foodMatcher';

export const dynamic = 'force-dynamic';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Tool definitions ────────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'criar_cardapio_no_diario',
    description: 'Cria refeições no diário alimentar do usuário a partir de um cardápio. USE apenas quando o usuário confirmar explicitamente que quer salvar/adicionar/importar o cardápio para o diário ("adiciona pra mim", "salva no diário", "importa esse cardápio"). NÃO chame essa ferramenta automaticamente ao sugerir um cardápio — primeiro apresente o cardápio em texto, pergunte se ele quer adicionar, e só chame após confirmação. Use nomes de alimentos comuns em português brasileiro (ex: "frango grelhado", "arroz branco", "batata doce", "ovo cozido"). O sistema faz o match automático com a base TACO. Sempre cite gramaturas concretas.',
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Data no formato YYYY-MM-DD. Para "hoje" use a data atual.',
        },
        meals: {
          type: 'array',
          description: 'Lista de refeições do dia.',
          items: {
            type: 'object',
            properties: {
              slot: {
                type: 'string',
                enum: ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'supper', 'cheat'],
                description: 'Horário: breakfast=café da manhã, snack1=lanche manhã, lunch=almoço, snack2=lanche tarde, dinner=jantar, supper=ceia, cheat=refeição lixo',
              },
              items: {
                type: 'array',
                description: 'Itens dessa refeição',
                items: {
                  type: 'object',
                  properties: {
                    foodName: { type: 'string', description: 'Nome do alimento em PT-BR. Ex: "frango grelhado", "arroz branco cozido".' },
                    grams: { type: 'number', description: 'Quantidade em gramas (peso preparado)' },
                  },
                  required: ['foodName', 'grams'],
                },
              },
            },
            required: ['slot', 'items'],
          },
        },
      },
      required: ['date', 'meals'],
    },
  },
  {
    name: 'criar_treino',
    description: 'Cria um treino na aba de treinos do usuário. USE apenas quando o usuário confirmar explicitamente que quer salvar/adicionar o treino. Primeiro apresente o treino em texto, pergunte se ele quer salvar, e só chame após confirmação. Inclua todas as séries e repetições.',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Data YYYY-MM-DD para o treino. "hoje" = data atual.' },
        name: { type: 'string', description: 'Nome curto do treino, ex: "Treino A — Peito/Tríceps", "Push Day", "Inferiores"' },
        duration: { type: 'number', description: 'Duração estimada em minutos (opcional)' },
        notes: { type: 'string', description: 'Observações gerais (opcional)' },
        sets: {
          type: 'array',
          description: 'Lista de séries do treino, em ordem. Para um exercício de 4 séries, gere 4 entradas com mesmo exercise e setNumber 1, 2, 3, 4.',
          items: {
            type: 'object',
            properties: {
              exercise: { type: 'string', description: 'Nome do exercício, ex: "Supino reto com barra"' },
              setNumber: { type: 'number', description: 'Número da série (1, 2, 3...)' },
              reps: { type: 'number', description: 'Repetições alvo' },
              loadKg: { type: 'number', description: 'Carga em kg (se aplicável, opcional)' },
              rir: { type: 'number', description: 'Reps in reserve / esforço (opcional)' },
              notes: { type: 'string', description: 'Observação da série (opcional)' },
            },
            required: ['exercise', 'setNumber', 'reps'],
          },
        },
      },
      required: ['date', 'name', 'sets'],
    },
  },
];

// ─── Tool executors ──────────────────────────────────────────────────────────

async function executeCriarCardapio(userId: string, input: { date: string; meals: Array<{ slot: string; items: Array<{ foodName: string; grams: number }> }> }): Promise<string> {
  const date = new Date(input.date + 'T12:00:00');
  if (isNaN(date.getTime())) return JSON.stringify({ error: 'Data inválida' });

  const allNames = input.meals.flatMap(m => m.items.map(i => i.foodName));
  const matched = await findFoodsByNames(allNames);

  const notFound: string[] = [];
  let idx = 0;
  let createdMeals = 0;
  let createdItems = 0;

  for (const meal of input.meals) {
    const items: { foodId: string; grams: number }[] = [];
    for (const it of meal.items) {
      const food = matched[idx++];
      if (food) items.push({ foodId: food.id, grams: it.grams });
      else notFound.push(it.foodName);
    }
    if (items.length === 0) continue;

    const created = await prisma.meal.create({
      data: { userId, date, slot: meal.slot, items: { createMany: { data: items } } },
    });
    createdMeals++;
    createdItems += items.length;
  }

  return JSON.stringify({
    success: true,
    createdMeals,
    createdItems,
    notFound,
    message: notFound.length
      ? `${createdMeals} refeições adicionadas (${createdItems} itens). ${notFound.length} alimentos não encontrados na base: ${notFound.join(', ')}. Você pode cadastrá-los manualmente.`
      : `${createdMeals} refeições adicionadas ao diário com ${createdItems} itens!`,
  });
}

async function executeCriarTreino(userId: string, input: { date: string; name: string; duration?: number; notes?: string; sets: Array<{ exercise: string; setNumber: number; reps: number; loadKg?: number; rir?: number; notes?: string }> }): Promise<string> {
  const date = new Date(input.date + 'T12:00:00');
  if (isNaN(date.getTime())) return JSON.stringify({ error: 'Data inválida' });

  const workout = await prisma.workout.create({
    data: {
      userId,
      date,
      name: input.name,
      duration: input.duration ?? null,
      notes: input.notes ?? null,
      sets: { createMany: { data: input.sets.map(s => ({
        exercise: s.exercise,
        setNumber: s.setNumber,
        reps: s.reps,
        loadKg: s.loadKg ?? null,
        rir: s.rir ?? null,
        notes: s.notes ?? null,
      })) } },
    },
    include: { sets: true },
  });

  return JSON.stringify({
    success: true,
    workoutId: workout.id,
    name: workout.name,
    setsCount: workout.sets.length,
    message: `Treino "${workout.name}" criado com ${workout.sets.length} séries!`,
  });
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages: rawMessages, quickAction } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      quickAction?: 'cardapio' | 'substituicao' | 'treino' | 'cheatday' | 'analise';
    };

    const session = await getSession();
    if (!session) return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });

    const user = await prisma.user.findUnique({ where: { accountId: session.accountId } });
    if (!user) return new Response(JSON.stringify({ error: 'Perfil não encontrado. Configure seu perfil primeiro.' }), { status: 400 });

    const [latestMeasure, latestLab, medications, todayMeals] = await Promise.all([
      prisma.measurement.findFirst({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
      prisma.labResult.findFirst({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
      prisma.medication.findMany({ where: { userId: user.id, active: true } }),
      (async () => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        return prisma.meal.findMany({
          where: { userId: user.id, date: { gte: today, lt: tomorrow } },
          include: { items: { include: { food: true } } },
        });
      })(),
    ]);

    let todayKcal = 0, todayProtein = 0;
    for (const meal of todayMeals) {
      for (const item of meal.items) {
        const f = item.grams / 100;
        todayKcal += item.food.kcal * f;
        todayProtein += item.food.protein * f;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const systemPrompt = buildCoachSystemPrompt({
      user, latestMeasure, latestLab, medications, todayKcal, todayProtein,
    }) + `\n\n## DATA E FERRAMENTAS\nData de hoje: ${today}\n\nVocê pode chamar as ferramentas \`criar_cardapio_no_diario\` e \`criar_treino\` para SALVAR o que você sugeriu no app do usuário — mas APENAS quando ele confirmar explicitamente ("salva", "adiciona", "importa"). Não chame ferramentas por iniciativa própria. Sempre pergunte primeiro se ele quer adicionar antes de chamar.`;

    const processed = [...rawMessages];
    if (quickAction && processed.length > 0) {
      const last = processed[processed.length - 1];
      if (last.role === 'user') {
        const prefixes: Record<string, string> = {
          cardapio: `[AÇÃO: GERAR CARDÁPIO COMPLETO] ${last.content}`,
          substituicao: `[AÇÃO: SUGERIR SUBSTITUIÇÕES DE ALIMENTOS] ${last.content}`,
          treino: `[AÇÃO: MONTAR TREINO PERSONALIZADO] ${last.content}`,
          cheatday: `[AÇÃO: PLANEJAR DIA LIXO CONTROLADO] ${last.content}`,
          analise: `[AÇÃO: ANALISAR MEU DIA ALIMENTAR E DAR FEEDBACK] ${last.content}`,
        };
        processed[processed.length - 1] = { ...last, content: prefixes[quickAction] ?? last.content };
      }
    }

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (obj: Record<string, unknown>) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

        try {
          // Loop multi-turn para tool use
          let convoMessages: Anthropic.MessageParam[] = processed.map(m => ({ role: m.role, content: m.content }));
          let rounds = 0;

          while (rounds < 5) {
            rounds++;
            const stream = await client.messages.stream({
              model: 'claude-haiku-4-5',
              max_tokens: 4096,
              system: systemPrompt,
              tools: TOOLS,
              messages: convoMessages,
            });

            const assistantBlocks: Anthropic.ContentBlock[] = [];
            let currentToolUse: { id: string; name: string; input: string } | null = null;

            for await (const event of stream) {
              if (event.type === 'content_block_start') {
                if (event.content_block.type === 'tool_use') {
                  currentToolUse = { id: event.content_block.id, name: event.content_block.name, input: '' };
                  send({ tool_start: { name: event.content_block.name } });
                }
              } else if (event.type === 'content_block_delta') {
                if (event.delta.type === 'text_delta') {
                  send({ text: event.delta.text });
                } else if (event.delta.type === 'input_json_delta' && currentToolUse) {
                  currentToolUse.input += event.delta.partial_json;
                }
              } else if (event.type === 'content_block_stop') {
                currentToolUse = null;
              }
            }

            const finalMsg = await stream.finalMessage();
            assistantBlocks.push(...finalMsg.content);
            convoMessages.push({ role: 'assistant', content: finalMsg.content });

            // Se não há tool_use, terminamos
            const toolUses = finalMsg.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
            if (toolUses.length === 0) break;

            // Executa cada tool e devolve resultado
            const toolResults: Anthropic.ToolResultBlockParam[] = [];
            for (const tu of toolUses) {
              let resultText: string;
              try {
                if (tu.name === 'criar_cardapio_no_diario') {
                  resultText = await executeCriarCardapio(user.id, tu.input as Parameters<typeof executeCriarCardapio>[1]);
                } else if (tu.name === 'criar_treino') {
                  resultText = await executeCriarTreino(user.id, tu.input as Parameters<typeof executeCriarTreino>[1]);
                } else {
                  resultText = JSON.stringify({ error: `Ferramenta desconhecida: ${tu.name}` });
                }
                const parsed = JSON.parse(resultText);
                send({ tool_result: { name: tu.name, success: parsed.success ?? false, message: parsed.message, link: tu.name === 'criar_cardapio_no_diario' ? '/diario' : '/treino' } });
              } catch (e) {
                resultText = JSON.stringify({ error: e instanceof Error ? e.message : 'erro desconhecido' });
                send({ tool_result: { name: tu.name, success: false, message: 'Erro ao executar a ação.' } });
              }
              toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: resultText });
            }

            convoMessages.push({ role: 'user', content: toolResults });
            // Continua loop pra IA responder após o tool result
          }

          send({ done: true });
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (e) {
          console.error('[AI chat]', e);
          send({ error: e instanceof Error ? e.message : 'erro desconhecido' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[AI chat error]', err);
    return new Response(JSON.stringify({ error: 'Erro no servidor de IA.' }), { status: 500 });
  }
}
