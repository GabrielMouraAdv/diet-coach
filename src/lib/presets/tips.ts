// Pílulas educativas para exibir no dashboard ("Dica do dia").
// Fontes:
//   - Haluch, "Metabolismo e Emagrecimento" (2020)
//   - Haluch, "Estratégias Nutricionais para Definição Muscular" (2019)
//   - Haluch, "Testosterona: Fisiologia, Estética e Saúde" (2020)
//   - Santos KS et al., RBONE v.19 n.120 (2025) — Tirzepatida
//   - Amaro CC et al., UNISUL (2025) — Tirzepatida

export interface Tip {
  id: number;
  text: string;
  source: string;
  category: 'dieta' | 'metabolismo' | 'treino' | 'hormonal' | 'mounjaro' | 'mindset';
}

export const TIPS: Tip[] = [
  // ─── Metabolismo e Emagrecimento (Haluch, 2020) ───────────────────────────
  {
    id: 1,
    text: 'O fator determinante para a perda de gordura é o déficit calórico — composição de macros vem depois.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 49',
    category: 'dieta',
  },
  {
    id: 2,
    text: 'Em déficit calórico, preocupar-se com índice glicêmico dos alimentos torna-se irrelevante. O total de calorias é o que manda.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 16',
    category: 'dieta',
  },
  {
    id: 3,
    text: 'Carga glicêmica importa mais que índice glicêmico — o tamanho da porção decide o impacto real na insulina.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 14',
    category: 'metabolismo',
  },
  {
    id: 4,
    text: 'Quanto maior o déficit, maior o catabolismo muscular. Proteína alta protege o que você treinou para construir.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 67',
    category: 'dieta',
  },
  {
    id: 5,
    text: 'Proteína gasta 20–30% das suas próprias calorias para ser metabolizada — é o macro mais termogênico.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 67',
    category: 'metabolismo',
  },
  {
    id: 6,
    text: 'Glicogênio hepático esgota em 12–18 h de jejum. Depois disso o corpo começa a quebrar músculo para fazer glicose.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 23',
    category: 'metabolismo',
  },
  {
    id: 7,
    text: 'Boa sensibilidade à insulina = músculo cheio depois de carboidrato. Resistência = inchaço e sono.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 28',
    category: 'metabolismo',
  },
  {
    id: 8,
    text: 'Cetose é adaptação para sobreviver à fome, não atalho de queima de gordura.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 50',
    category: 'dieta',
  },
  {
    id: 9,
    text: 'Fibra alimentar reduz fome, glicemia e LDL. Mire 25–35 g/dia, ou 14 g a cada 1000 kcal.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 10',
    category: 'dieta',
  },
  {
    id: 10,
    text: 'Whey, ovo e leite têm PDCAAS 100; soja 91; trigo 42. Qualidade da proteína conta quando o aporte é baixo.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 57',
    category: 'dieta',
  },
  // ─── Estratégias Nutricionais (Haluch, 2019) ──────────────────────────────
  {
    id: 11,
    text: 'Em dieta com restrição, proteína sobe para 2,0–3,5 g por kg de peso. Protege músculo e aumenta saciedade.',
    source: 'Haluch — Estratégias Nutricionais, pg 68',
    category: 'dieta',
  },
  {
    id: 12,
    text: 'Não existe janela anabólica de 30 minutos. A janela dura horas — distribua proteína ao longo do dia.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'treino',
  },
  {
    id: 13,
    text: 'Vegetais são praticamente livres: 1 kg de tomate tem 150 kcal e 12 g de fibra. Não conte calorias deles.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  {
    id: 14,
    text: 'A refeição lixo funciona melhor logo pós-treino: sensibilidade à insulina no pico, glicogênio pedindo recarga.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  {
    id: 15,
    text: 'Comer carboidrato à noite não engorda nem inibe GH. É um mito antigo do fisiculturismo.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  {
    id: 16,
    text: 'Treinar em jejum não derrete músculo se você comeu bem na ceia. Catabolismo é crônico, não de poucas horas.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'treino',
  },
  {
    id: 17,
    text: 'Em cutting, prefira frutas de baixa carga glicêmica: melancia, melão, morango, abacaxi, mamão.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  {
    id: 18,
    text: 'Quando a perda estagnar por 8–16 semanas, suba carbo por 2–4 semanas. A recarga restaura leptina e quebra o platô.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'metabolismo',
  },
  {
    id: 19,
    text: 'Restringir carbo antes de restringir vegetais e leguminosas. Arroz e batata saem primeiro, brócolis fica.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  {
    id: 20,
    text: 'Refeição lixo 1×/semana tem efeito metabólico positivo: suprarregula leptina e melhora adesão de longo prazo.',
    source: 'Haluch — Estratégias Nutricionais',
    category: 'dieta',
  },
  // ─── Testosterona (Haluch, 2020) ──────────────────────────────────────────
  {
    id: 21,
    text: 'Estradiol baixo é sempre um problema. Estradiol alto só é problema se a testosterona também está baixa.',
    source: 'Haluch — Testosterona: Fisiologia, Estética e Saúde',
    category: 'hormonal',
  },
  {
    id: 22,
    text: 'Hematócrito acima de 54% é gatilho para suspender testosterona ou fazer flebotomia. Monitore regularmente.',
    source: 'Haluch — Testosterona',
    category: 'hormonal',
  },
  {
    id: 23,
    text: 'Testo booster não promove hipertrofia. Só doses suprafisiológicas ou correção de hipogonadismo mudam composição corporal.',
    source: 'Haluch — Testosterona',
    category: 'hormonal',
  },
  {
    id: 24,
    text: 'Obeso tem testosterona baixa porque o tecido adiposo aromatiza T em estradiol. Perder peso muitas vezes resolve.',
    source: 'Haluch — Testosterona',
    category: 'hormonal',
  },
  {
    id: 25,
    text: 'Suprimir estradiol com anastrozol para "secar" é mito: sem E2, a gordura sobe. Não zere estradiol.',
    source: 'Haluch — Testosterona (estudo Finkelstein)',
    category: 'hormonal',
  },
  {
    id: 26,
    text: 'Síntese proteica tem limite: comer mais de 2,2 g/kg de proteína raramente traz ganho extra para natural.',
    source: 'Haluch — Testosterona',
    category: 'dieta',
  },
  {
    id: 27,
    text: '40 a 70% dos usuários de testosterona ficam azoospérmicos. Se planeja filhos, discuta hCG com seu médico.',
    source: 'Haluch — Testosterona',
    category: 'hormonal',
  },
  // ─── Tirzepatida (Santos KS et al., RBONE 2025) ───────────────────────────
  {
    id: 28,
    text: 'Consistência vence velocidade. Estudos acima de 52 semanas com Mounjaro mostram perdas de peso até 2× maiores que estudos curtos.',
    source: 'Santos KS et al., Rev. Bras. Obesidade, Nutrição e Emagrecimento, v.19, n.120, 2025',
    category: 'mounjaro',
  },
  {
    id: 29,
    text: 'Interromper o Mounjaro sem orientação médica aumenta o risco de reganho de peso. O medicamento trata uma condição crônica.',
    source: 'Santos KS et al., RBONE 2025 (SURMOUNT-4)',
    category: 'mounjaro',
  },
  {
    id: 30,
    text: 'Náusea e diarreia são mais intensas nas primeiras semanas após aumento de dose e tendem a diminuir. Refeições pequenas ajudam.',
    source: 'Santos KS et al., RBONE 2025',
    category: 'mounjaro',
  },
  {
    id: 31,
    text: 'Com o apetite reduzido pelo Mounjaro, priorize proteína em cada refeição para proteger sua massa muscular.',
    source: 'Santos KS et al., RBONE 2025',
    category: 'mounjaro',
  },
  {
    id: 32,
    text: 'Na dose de 15 mg por 72–88 semanas, alguns pacientes perderam até 25% do peso — equivalente à cirurgia bariátrica.',
    source: 'Santos KS et al., RBONE 2025 (Aronne 2024)',
    category: 'mounjaro',
  },
  // ─── Tirzepatida (Amaro CC, UNISUL 2025) ──────────────────────────────────
  {
    id: 33,
    text: 'Tirzepatida age em dois receptores (GLP-1 + GIP) ao mesmo tempo — por isso reduz mais peso que outros injetáveis disponíveis.',
    source: 'Amaro CC, UNISUL 2025',
    category: 'mounjaro',
  },
  {
    id: 34,
    text: 'Não escale a dose se estiver com náusea intensa. Ficar mais tempo na dose atual é mais seguro que descontinuar.',
    source: 'Amaro CC, UNISUL 2025',
    category: 'mounjaro',
  },
  {
    id: 35,
    text: 'Comer devagar e em porções menores não é só uma dica — é o que o medicamento pede. O esvaziamento gástrico fica mais lento.',
    source: 'Amaro CC, UNISUL 2025',
    category: 'mounjaro',
  },
  {
    id: 36,
    text: '64% dos pacientes sem diabetes perderam 15% ou mais do peso em 72 semanas com Mounjaro. Resultados chegam com consistência.',
    source: 'Amaro CC, UNISUL 2025 (SURMOUNT-1)',
    category: 'mounjaro',
  },
  // ─── Mindset / Gerais ─────────────────────────────────────────────────────
  {
    id: 37,
    text: 'Restrição calórica intensa por mais de 30 dias pode derrubar testosterona livre significativamente. Deficits extremos têm custo hormonal.',
    source: 'Haluch — Testosterona (estudo Longland)',
    category: 'hormonal',
  },
  {
    id: 38,
    text: 'Low-carb vs low-fat: no longo prazo (> 1 ano), perda de gordura é semelhante entre as duas estratégias. Escolha a que você adere.',
    source: 'Haluch — Metabolismo e Emagrecimento, pg 31',
    category: 'dieta',
  },
];

/** Retorna uma tip aleatória, opcionalmente filtrada por categoria */
export function getRandomTip(category?: Tip['category']): Tip {
  const pool = category ? TIPS.filter((t) => t.category === category) : TIPS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Retorna a tip do dia baseada na data (determinístico — mesma tip o dia inteiro) */
export function getTipOfDay(date: Date = new Date()): Tip {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TIPS[dayOfYear % TIPS.length];
}
