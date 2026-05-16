'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Loader2, Salad, ArrowLeftRight, Dumbbell, Pizza, BarChart2, Trash2, Check, ExternalLink, AlertCircle, Wrench } from 'lucide-react';

type ToolEvent = {
  kind: 'tool';
  name: string;
  status: 'running' | 'success' | 'error';
  message?: string;
  link?: string;
};

type Message =
  | { role: 'user' | 'assistant'; content: string }
  | { role: 'tool'; events: ToolEvent[] };

type QuickAction = 'cardapio' | 'substituicao' | 'treino' | 'cheatday' | 'analise';

const QUICK_ACTIONS: { key: QuickAction; label: string; icon: React.ReactNode; prompt: string }[] = [
  {
    key: 'cardapio',
    icon: <Salad size={16} />,
    label: 'Cardápio do dia',
    prompt: 'Monte um cardápio completo pra mim hoje, respeitando minha meta calórica e preferências.',
  },
  {
    key: 'substituicao',
    icon: <ArrowLeftRight size={16} />,
    label: 'Substituir alimento',
    prompt: 'Quero substituir um alimento. Me dá opções equivalentes por proteína e calorias para os alimentos que eu mencionar.',
  },
  {
    key: 'treino',
    icon: <Dumbbell size={16} />,
    label: 'Sugerir treino',
    prompt: 'Monte um treino completo para hoje baseado no meu objetivo, com exercícios, séries, repetições e descanso.',
  },
  {
    key: 'cheatday',
    icon: <Pizza size={16} />,
    label: 'Planejar dia lixo',
    prompt: 'Me ajuda a planejar minha refeição lixo pra essa semana dentro das calorias permitidas, com o melhor momento do dia.',
  },
  {
    key: 'analise',
    icon: <BarChart2 size={16} />,
    label: 'Analisar meu dia',
    prompt: 'Analisa o que comi hoje e me dá um feedback: está no caminho certo? O que ajustar?',
  },
];

const WELCOME = `Oi! Sou seu coach de dieta e bem-estar. Posso te ajudar com:

🥗 **Cardápios** personalizados — posso salvar no seu diário com 1 clique
💪 **Treinos** baseados no seu objetivo — posso adicionar direto na aba Treino
🔄 **Substituições** de alimentos por equivalência proteica e calórica
🍕 **Dia lixo** planejado e controlado
📊 **Análise** do que você está comendo

✨ **Novidade:** depois de sugerir um cardápio ou treino, é só me pedir "salva pra mim" que eu adiciono direto no app.

Use os botões abaixo ou me pergunte o que quiser!`;

export function CoachChat({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME.replace('Oi!', `Oi, ${userName}!`) },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<QuickAction | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string, action?: QuickAction) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setActiveAction(action);

    // Placeholder da resposta
    setMessages(m => [...m, { role: 'assistant', content: '' }]);

    try {
      const apiMessages = newMessages
        .filter((m): m is Extract<Message, { role: 'user' | 'assistant' }> => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, quickAction: action }),
      });

      if (!res.ok) throw new Error('Erro na API');
      if (!res.body) throw new Error('Sem corpo na resposta');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // mantém linha incompleta no buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.text) {
              fullText += parsed.text;
              setMessages(m => {
                const next = [...m];
                // Atualiza a última mensagem assistant; se não for, cria nova
                const last = next[next.length - 1];
                if (last && last.role === 'assistant') {
                  next[next.length - 1] = { role: 'assistant', content: fullText };
                } else {
                  next.push({ role: 'assistant', content: fullText });
                }
                return next;
              });
            }

            if (parsed.tool_start) {
              // Reset fullText (próximo turno do AI)
              fullText = '';
              const toolName = parsed.tool_start.name as string;
              setMessages(m => {
                const next = [...m];
                const last = next[next.length - 1];
                const event: ToolEvent = { kind: 'tool', name: toolName, status: 'running' };
                if (last?.role === 'tool') {
                  next[next.length - 1] = { role: 'tool', events: [...last.events, event] };
                } else {
                  next.push({ role: 'tool', events: [event] });
                }
                // Adiciona próximo placeholder assistant para os próximos deltas
                next.push({ role: 'assistant', content: '' });
                return next;
              });
            }

            if (parsed.tool_result) {
              const tr = parsed.tool_result as { name: string; success: boolean; message?: string; link?: string };
              setMessages(m => {
                const next = [...m];
                // Encontra a última msg tool e atualiza o evento correspondente
                for (let i = next.length - 1; i >= 0; i--) {
                  const msg = next[i];
                  if (msg.role === 'tool') {
                    const evs = msg.events.map(ev =>
                      ev.name === tr.name && ev.status === 'running'
                        ? { ...ev, status: tr.success ? 'success' as const : 'error' as const, message: tr.message, link: tr.link }
                        : ev
                    );
                    next[i] = { role: 'tool', events: evs };
                    break;
                  }
                }
                return next;
              });
            }

            if (parsed.error) throw new Error(parsed.error);
          } catch (err) {
            if (err instanceof SyntaxError) continue; // JSON parse fail — pula linha
            throw err;
          }
        }
      }
    } catch (e) {
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'assistant', content: `⚠️ Erro: ${e instanceof Error ? e.message : 'falha na comunicação com a IA'}.` },
      ]);
    } finally {
      setLoading(false);
      setActiveAction(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    sendMessage(action.prompt, action.key);
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME.replace('Oi!', `Oi, ${userName}!`) }]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      {/* Ações rápidas */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.key}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
              ${activeAction === action.key
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-ink-600 border-ink-200 hover:border-brand-400 hover:text-brand-700'
              } disabled:opacity-50`}
          >
            {activeAction === action.key ? <Loader2 size={14} className="animate-spin" /> : action.icon}
            {action.label}
          </button>
        ))}
        <button onClick={clearChat} disabled={loading} className="ml-auto flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600 px-2">
          <Trash2 size={13} /> Limpar
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1">
        {messages.map((msg, i) => {
          // Eventos de ferramenta (criar cardápio / treino)
          if (msg.role === 'tool') {
            return (
              <div key={i} className="space-y-2 mx-2">
                {msg.events.map((ev, j) => {
                  const label = ev.name === 'criar_cardapio_no_diario' ? 'Adicionando cardápio ao diário' :
                               ev.name === 'criar_treino' ? 'Salvando treino' : ev.name;
                  if (ev.status === 'running') {
                    return (
                      <div key={j} className="flex items-center gap-2 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-3 py-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span>{label}...</span>
                      </div>
                    );
                  }
                  if (ev.status === 'success') {
                    return (
                      <div key={j} className="flex items-start gap-2 text-sm text-brand-700 bg-brand-50 border border-brand-300 rounded-xl px-3 py-2.5">
                        <Check size={16} className="flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{label} ✓</p>
                          {ev.message && <p className="text-xs text-brand-600 mt-0.5">{ev.message}</p>}
                          {ev.link && (
                            <Link href={ev.link} className="text-xs font-medium text-brand-700 underline mt-1 inline-flex items-center gap-1 hover:text-brand-900">
                              Abrir <ExternalLink size={11} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={j} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium">Falha ao {label.toLowerCase()}</p>{ev.message && <p className="text-xs mt-0.5">{ev.message}</p>}</div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Mensagem normal (user ou assistant)
          return (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0 mr-2 mt-0.5">
                  🤖
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-white border shadow-sm text-ink-800 rounded-tl-sm'
                }`}
              >
                {msg.content === '' && msg.role === 'assistant'
                  ? <span className="flex items-center gap-2 text-ink-400"><Loader2 size={14} className="animate-spin" /> Pensando...</span>
                  : <MarkdownText text={msg.content} />
                }
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
          placeholder="Pergunte sobre dieta, substituições, treino..."
          rows={2}
          disabled={loading}
          className="flex-1 input resize-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary px-4 self-end h-10 flex-shrink-0"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>

      <p className="text-center text-xs text-ink-400 flex-shrink-0">
        Coach IA não substitui médico ou nutricionista. Para ajuste de hormônios e exames anormais, consulte seu médico.
      </p>
    </div>
  );
}

// Renderização básica de markdown (negrito, código, listas)
function MarkdownText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Heading
        if (line.startsWith('### ')) return <p key={i} className="font-bold text-base mt-2">{formatInline(line.slice(4))}</p>;
        if (line.startsWith('## '))  return <p key={i} className="font-bold text-lg mt-3">{formatInline(line.slice(3))}</p>;
        if (line.startsWith('# '))   return <p key={i} className="font-bold text-xl mt-3">{formatInline(line.slice(2))}</p>;
        // List
        if (line.startsWith('- ') || line.startsWith('* '))
          return <p key={i} className="flex gap-1"><span>•</span><span>{formatInline(line.slice(2))}</span></p>;
        if (/^\d+\. /.test(line))
          return <p key={i} className="flex gap-1"><span>{line.match(/^\d+/)?.[0]}.</span><span>{formatInline(line.replace(/^\d+\. /, ''))}</span></p>;
        // Blank
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{formatInline(line)}</p>;
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-ink-100 rounded px-1 text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
