import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { buildCoachSystemPrompt } from '@/lib/ai-context';

export const dynamic = 'force-dynamic';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, quickAction } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      quickAction?: 'cardapio' | 'substituicao' | 'treino' | 'cheatday' | 'analise';
    };

    // Carrega contexto do usuário
    const user = await prisma.user.findFirst();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Perfil não encontrado. Configure seu perfil primeiro.' }), { status: 400 });
    }

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

    // Calcula macros de hoje
    let todayKcal = 0, todayProtein = 0;
    for (const meal of todayMeals) {
      for (const item of meal.items) {
        const f = item.grams / 100;
        todayKcal += item.food.kcal * f;
        todayProtein += item.food.protein * f;
      }
    }

    const systemPrompt = buildCoachSystemPrompt({
      user, latestMeasure, latestLab, medications, todayKcal, todayProtein,
    });

    // Adiciona prefixo de ação rápida na última mensagem do usuário
    const processedMessages = [...messages];
    if (quickAction && processedMessages.length > 0) {
      const last = processedMessages[processedMessages.length - 1];
      if (last.role === 'user') {
        const prefixes: Record<string, string> = {
          cardapio: `[AÇÃO: GERAR CARDÁPIO COMPLETO] ${last.content}`,
          substituicao: `[AÇÃO: SUGERIR SUBSTITUIÇÕES DE ALIMENTOS] ${last.content}`,
          treino: `[AÇÃO: MONTAR TREINO PERSONALIZADO] ${last.content}`,
          cheatday: `[AÇÃO: PLANEJAR DIA LIXO CONTROLADO] ${last.content}`,
          analise: `[AÇÃO: ANALISAR MEU DIA ALIMENTAR E DAR FEEDBACK] ${last.content}`,
        };
        processedMessages[processedMessages.length - 1] = { ...last, content: prefixes[quickAction] ?? last.content };
      }
    }

    // Streaming com claude-haiku-4-5
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: processedMessages,
    });

    // Converte para ReadableStream SSE
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (e) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(e) })}\n\n`));
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
    console.error('[AI chat]', err);
    return new Response(JSON.stringify({ error: 'Erro no servidor de IA.' }), { status: 500 });
  }
}
