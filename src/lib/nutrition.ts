// Fórmulas nutricionais — BMR, TDEE, macros, recálculo de cheat day.
// Referências incorporadas:
//   - Mifflin-St Jeor (BMR padrão)
//   - Katch-McArdle (BMR com %BF)
//   - Haluch, "Metabolismo e Emagrecimento" (2020) — TID, fibras, presets de dieta
//   - Haluch, "Estratégias Nutricionais" (2019) — fator atividade, déficit por perfil, cheat meal
//   - Haluch, "Testosterona" (2020) — alertas hormonais

export type Sex = 'M' | 'F';
export type Goal = 'cut' | 'maintain' | 'bulk' | 'recomp';
export type ActivityLevel =
  | 'very_sedentary'
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'
  | 'extreme';
export type InsulinSensitivity = 'high' | 'normal' | 'low';
export type DietPreset = 'low_carb' | 'low_fat' | 'keto' | 'cycling' | 'flexible';

// ─── Fatores de atividade (Haluch — Estratégias Nutricionais) ────────────────
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  very_sedentary: 1.4,
  sedentary: 1.5,
  light: 1.6,
  moderate: 1.7,
  active: 1.8,
  very_active: 1.9,
  extreme: 2.0,
};

export const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  very_sedentary: 'Muito sedentário (acamado, sem treino)',
  sedentary: 'Sedentário (pouco movimento, sem treino)',
  light: 'Levemente ativo (caminhada / treino leve 2x/sem)',
  moderate: 'Moderado (treino 3–4x/sem)',
  active: 'Ativo (treino 5–6x/sem)',
  very_active: 'Muito ativo (treino diário intenso)',
  extreme: 'Extremo (treino 2x/dia ou trabalho físico pesado)',
};

// ─── BMR ──────────────────────────────────────────────────────────────────────

export function bmrMifflin(opts: {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  sex: Sex;
}): number {
  const { weightKg, heightCm, ageYears, sex } = opts;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === 'M' ? base + 5 : base - 161;
}

export function bmrKatchMcArdle(opts: {
  weightKg: number;
  bodyFatPct: number;
}): number {
  const { weightKg, bodyFatPct } = opts;
  const leanMass = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * leanMass;
}

export function calcBMR(opts: {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  sex: Sex;
  bodyFatPct?: number | null;
}): { value: number; method: 'mifflin' | 'katch' } {
  if (opts.bodyFatPct && opts.bodyFatPct > 0 && opts.bodyFatPct < 60) {
    return {
      value: bmrKatchMcArdle({ weightKg: opts.weightKg, bodyFatPct: opts.bodyFatPct }),
      method: 'katch',
    };
  }
  return { value: bmrMifflin(opts), method: 'mifflin' };
}

// ─── TDEE ─────────────────────────────────────────────────────────────────────

export function calcTDEE(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_FACTORS[activity];
}

// ─── Déficit calórico recomendado (Haluch — Estratégias, tabela 3.5) ─────────

export function suggestDeficit(opts: {
  sex: Sex;
  bodyFatPct?: number | null;
  usingHormones?: boolean;
}): { min: number; max: number; note: string } {
  if (opts.usingHormones) {
    return { min: 700, max: 1500, note: 'Usuário de hormônios — déficit pode ser mais agressivo' };
  }
  const isObese = opts.bodyFatPct ? opts.bodyFatPct >= (opts.sex === 'M' ? 25 : 32) : false;
  if (isObese) return { min: 800, max: 1500, note: 'Obesidade — déficit alto tolerado' };
  if (opts.sex === 'M') return { min: 500, max: 800, note: 'Homem eutrófico' };
  return { min: 400, max: 600, note: 'Mulher eutrófica' };
}

// ─── Alvo calórico por objetivo ──────────────────────────────────────────────

export function suggestKcalTarget(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'cut':       return Math.round(tdee * 0.80);
    case 'maintain':  return Math.round(tdee);
    case 'bulk':      return Math.round(tdee * 1.10);
    case 'recomp':    return Math.round(tdee * 0.95);
  }
}

// ─── Presets de dieta (Haluch — Metabolismo, Tabela 3.3) ─────────────────────

export interface DietPresetSpec {
  label: string;
  carbPct: [number, number];
  proteinPct: [number, number];
  fatPct: [number, number];
  proteinPerKg: [number, number];
  bestFor: string;
}

export const DIET_PRESETS: Record<DietPreset, DietPresetSpec> = {
  low_carb: {
    label: 'Low-carb / High-protein',
    carbPct: [20, 45],
    proteinPct: [30, 45],
    fatPct: [20, 30],
    proteinPerKg: [2.0, 3.5],
    bestFor: 'Resistente à insulina; inchaço/sono com carbo; gordura abdominal',
  },
  low_fat: {
    label: 'Low-fat / High-protein (clássico fisiculturismo)',
    carbPct: [20, 45],
    proteinPct: [30, 65],
    fatPct: [10, 15],
    proteinPerKg: [2.0, 4.0],
    bestFor: 'Sensível à insulina; energia estável com carbo; %BF baixo natural',
  },
  keto: {
    label: 'Cetogênica',
    carbPct: [5, 10],
    proteinPct: [20, 30],
    fatPct: [60, 80],
    proteinPerKg: [1.5, 2.0],
    bestFor: 'Saciedade extrema, epilepsia; não tem vantagem vs low-carb para fat-loss',
  },
  cycling: {
    label: 'Ciclo de carboidratos',
    carbPct: [15, 50],
    proteinPct: [25, 40],
    fatPct: [20, 35],
    proteinPerKg: [2.0, 3.0],
    bestFor: 'Quebra de platô; alterna dias low/mod/high carb',
  },
  flexible: {
    label: 'Flexível (IIFYM)',
    carbPct: [30, 55],
    proteinPct: [25, 35],
    fatPct: [20, 30],
    proteinPerKg: [2.0, 2.5],
    bestFor: 'Adesão de longo prazo, 80/20',
  },
};

export function suggestPreset(opts: { insulin: InsulinSensitivity; bodyFatPct?: number | null }): DietPreset {
  if (opts.insulin === 'low') return 'low_carb';
  if (opts.insulin === 'high') return 'low_fat';
  if (opts.bodyFatPct && opts.bodyFatPct >= 25) return 'low_carb';
  return 'flexible';
}

// ─── Macros ──────────────────────────────────────────────────────────────────

export interface MacroTargets {
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

/**
 * Cálculo de macros. Se preset for fornecido, usa proteinPerKg médio da faixa
 * e gordura = % do total dentro da faixa do preset. Caso contrário usa
 * a regra padrão: 2.0g/kg prot, 0.8g/kg fat, resto carbo.
 *
 * Em déficit agressivo (kcal/peso < 25) sobe automaticamente a proteína
 * para 2.5g/kg conforme Haluch — Metabolismo, pg 67.
 */
export function calcMacros(opts: {
  kcal: number;
  weightKg: number;
  preset?: DietPreset;
  proteinPerKg?: number;
  fatPerKg?: number;
}): MacroTargets {
  const aggressiveDeficit = opts.kcal / opts.weightKg < 25;
  let proteinPerKg = opts.proteinPerKg ?? 2.0;
  let fatPerKg = opts.fatPerKg ?? 0.8;

  if (opts.preset) {
    const p = DIET_PRESETS[opts.preset];
    proteinPerKg = opts.proteinPerKg ?? (p.proteinPerKg[0] + p.proteinPerKg[1]) / 2;
  }
  if (aggressiveDeficit && !opts.proteinPerKg) {
    proteinPerKg = Math.max(proteinPerKg, 2.5);
  }

  const proteinG = Math.round(opts.weightKg * proteinPerKg);
  let fatG = Math.round(opts.weightKg * fatPerKg);

  if (opts.preset === 'keto') {
    const fatKcal = opts.kcal * 0.70;
    fatG = Math.round(fatKcal / 9);
  } else if (opts.preset === 'low_fat') {
    fatG = Math.round((opts.kcal * 0.125) / 9);
  } else if (opts.preset === 'low_carb') {
    fatG = Math.round((opts.kcal * 0.25) / 9);
  }

  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = Math.max(0, opts.kcal - proteinKcal - fatKcal);
  const carbG = Math.round(carbKcal / 4);

  return { kcal: opts.kcal, proteinG, carbG, fatG };
}

// ─── Cheat day & zigzag (Haluch — Estratégias, pg 53–57) ─────────────────────

/**
 * Cheat meal protocol:
 *   - 1x por semana (1 refeição ou dia inteiro)
 *   - melhor janela: pós-treino do dia mais intenso
 *   - compensação opcional (zigzag): distribui o delta nos N dias seguintes
 *   - mecanismo: suprarregula leptina + sensibilidade à insulina
 */
export function planCheatDay(opts: {
  baseKcal: number;
  cheatKcal: number;
  compensationDays?: number;
}): { dayKcal: number; delta: number; compensationPerDay: number; tip: string } {
  const delta = opts.cheatKcal - opts.baseKcal;
  const compDays = opts.compensationDays ?? 0;
  const compensationPerDay = compDays > 0 ? Math.round(delta / compDays) : 0;
  return {
    dayKcal: opts.cheatKcal,
    delta,
    compensationPerDay,
    tip: 'Concentre a refeição lixo logo após o treino mais pesado da semana — sensibilidade à insulina no pico e glicogênio pedindo recarga.',
  };
}

// ─── Macros de um alimento por porção ────────────────────────────────────────

export interface FoodLike {
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
}

export function macrosForGrams(food: FoodLike, grams: number) {
  const f = grams / 100;
  return {
    kcal: food.kcal * f,
    protein: food.protein * f,
    carb: food.carb * f,
    fat: food.fat * f,
  };
}

// ─── Equivalência p/ substituição ────────────────────────────────────────────

export function substituteGrams(opts: {
  foodA: FoodLike;
  foodB: FoodLike;
  gramsA: number;
  basis: 'kcal' | 'protein' | 'carb' | 'fat';
}): number {
  const { foodA, foodB, gramsA, basis } = opts;
  const a = (foodA[basis] * gramsA) / 100;
  const bPer100 = foodB[basis];
  if (bPer100 <= 0) return 0;
  return Math.round((a * 100) / bPer100);
}

// ─── Fibras (Haluch — Metabolismo, pg 10) ────────────────────────────────────

export function fiberTarget(kcal: number): { min: number; max: number } {
  return { min: Math.round((kcal / 1000) * 14), max: 35 };
}

// ─── Idade em anos ───────────────────────────────────────────────────────────

export function yearsBetween(birth: Date, ref: Date = new Date()): number {
  let years = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) years--;
  return years;
}

// ─── Estimativa de % Gordura Corporal ────────────────────────────────────────
// Fonte: Taylor KM, Castellani MP, Bartlett PM, Oliver TE, McClung HL.
// "Development and cross-validation of a circumference-based predictive equation
//  to estimate body fat in an active population." Obes Sci Pract. 2024;e747.
// DOI: 10.1002/osp4.747
//
// Unidades: CIRCUNFERÊNCIAS EM POLEGADAS, peso em kg.
// As equações foram validadas em 1.904 militares (DXA como critério).
// 1-sítio (só abdômen): RMSE ~3.4-4.1% — superior à equação tradicional do Exército.

export type BFSites = 1 | 2 | 3;

const CM_TO_IN = 0.393701;

export function cmToInches(cm: number): number { return cm * CM_TO_IN; }
export function inchesToCm(inches: number): number { return inches / CM_TO_IN; }

interface BodyFatInput {
  sex: 'M' | 'F';
  abdomenCm: number;  // perímetro do abdômen ao nível do umbigo
  weightKg: number;
  hipCm?: number;      // ponto mais largo do quadril (necessário para 2 ou 3 sítios)
  waistCm?: number;    // parte mais estreita da cintura (necessário para 3 sítios)
}

export interface BodyFatResult {
  bodyFatPct: number;
  sites: BFSites;
  category: 'essencial' | 'atletico' | 'fitness' | 'aceitavel' | 'obeso';
}

/** Categoria de %BF para homens e mulheres (American Council on Exercise). */
function bfCategory(pct: number, sex: 'M' | 'F'): BodyFatResult['category'] {
  if (sex === 'M') {
    if (pct < 6)  return 'essencial';
    if (pct < 14) return 'atletico';
    if (pct < 18) return 'fitness';
    if (pct < 25) return 'aceitavel';
    return 'obeso';
  } else {
    if (pct < 14) return 'essencial';
    if (pct < 21) return 'atletico';
    if (pct < 25) return 'fitness';
    if (pct < 32) return 'aceitavel';
    return 'obeso';
  }
}

/**
 * Estima %BF a partir de circunferências (Taylor et al. 2024).
 * Usa automaticamente a equação de maior precisão disponível conforme as medidas.
 */
export function estimateBodyFat(input: BodyFatInput): BodyFatResult {
  const abdomen = cmToInches(input.abdomenCm);  // polegadas
  const weight = input.weightKg;                 // kg
  const hip = input.hipCm ? cmToInches(input.hipCm) : null;
  const waist = input.waistCm ? cmToInches(input.waistCm) : null;

  let pct: number;
  let sites: BFSites;

  if (input.sex === 'M') {
    if (abdomen && hip && waist) {
      // 3-sítios: %BF = -38.32 + 2.23*abd + 0.68*hip - 0.43*waist - 0.16*weight
      pct = -38.32 + 2.23 * abdomen + 0.68 * hip - 0.43 * waist - 0.16 * weight;
      sites = 3;
    } else if (abdomen && hip) {
      // 2-sítios: %BF = -41.39 + 1.89*abd + 0.74*hip - 0.17*weight
      pct = -41.39 + 1.89 * abdomen + 0.74 * hip - 0.17 * weight;
      sites = 2;
    } else {
      // 1-sítio: %BF = -27.05 + 2.06*abd - 0.12*weight
      pct = -27.05 + 2.06 * abdomen - 0.12 * weight;
      sites = 1;
    }
  } else {
    if (abdomen && hip && waist) {
      // 3-sítios: %BF = -34.92 + 0.87*abd + 1.22*hip + 0.39*waist - 0.14*weight
      pct = -34.92 + 0.87 * abdomen + 1.22 * hip + 0.39 * waist - 0.14 * weight;
      sites = 3;
    } else if (abdomen && hip) {
      // 2-sítios: %BF = -31.68 + 1.09*abd + 1.18*hip - 0.12*weight
      pct = -31.68 + 1.09 * abdomen + 1.18 * hip - 0.12 * weight;
      sites = 2;
    } else {
      // 1-sítio: %BF = -8.06 + 1.25*abd - 0.004*weight
      pct = -8.06 + 1.25 * abdomen - 0.004 * weight;
      sites = 1;
    }
  }

  // Sanitiza: %BF deve estar entre 3% e 60%
  pct = Math.max(3, Math.min(60, pct));
  pct = Math.round(pct * 10) / 10; // 1 casa decimal

  return { bodyFatPct: pct, sites, category: bfCategory(pct, input.sex) };
}

export const BF_CATEGORY_LABEL: Record<BodyFatResult['category'], string> = {
  essencial: 'Essencial',
  atletico: 'Atlético',
  fitness: 'Fitness',
  aceitavel: 'Aceitável',
  obeso: 'Acima do ideal',
};

// ─── Ajuste hormonal do BMR ──────────────────────────────────────────────────
// Fontes:
//   - Haluch, "Testosterona" (2020): AAS → ↑ síntese proteica, ↑ massa magra, ↑ TMB
//   - Santos KS et al., RBONE 2025: GLP-1/GIP → perda de peso rápida → ↑ necessidade proteica
//   - Amaro CC, UNISUL 2025: tirzepatida → proteína 1,2-1,5g/kg para preservar massa magra
//   - Literatura de endocrinologia esportiva: TRT fisiológica +5-8% TMB; supra +10-20%

export interface HormonalProfile {
  hasTRT: boolean;
  hasAAS: boolean;
  hasGLP1: boolean;
  hasThyroid: boolean;
  trtDose?: 'physiologic' | 'supraphysiologic';
}

/**
 * Detecta o perfil hormonal a partir dos nomes dos medicamentos ativos.
 * Usado para ajustar BMR e metas de proteína.
 */
export function detectHormonalProfile(medicationNames: string[]): HormonalProfile {
  const lower = medicationNames.map(m => m.toLowerCase());
  const contains = (terms: string[]) => lower.some(m => terms.some(t => m.includes(t)));

  const hasTRT = contains(['cipionato', 'enantato', 'testosterona', 'durateston', 'nebido', 'androgel', 'undecanoato']);
  const hasAAS = contains(['nandrolona', 'boldenona', 'trembolona', 'masteron', 'deca', 'stanozolol', 'oxandrolona', 'hemogenin', 'dianabol', 'primobolan', 'turinabol', 'halotestin', 'oximetolona']);
  const hasGLP1 = contains(['tirzepatida', 'mounjaro', 'semaglutida', 'ozempic', 'wegovy', 'rybelsus', 'liraglutida', 'victoza']);
  const hasThyroid = contains(['levotiroxina', 'puran', 't4', 't3', 'cytomel', 'synthroid']);

  return { hasTRT, hasAAS, hasGLP1, hasThyroid };
}

/**
 * Multiplicador do BMR considerando o perfil hormonal.
 *
 * TRT fisiológica:    +7%  — mais massa magra, maior custo de manutenção
 * AAS suprafisiológico: +15% — síntese proteica e massa magra muito elevadas
 * GLP-1/GIP:          sem ajuste direto no TMB (reduz apetite, não eleva metabolismo),
 *                     mas proteína deve subir para 1,5g/kg para preservar massa
 * T4 (reposição):     sem ajuste (se TSH normalizado)
 */
export function calcHormonalBMRMultiplier(profile: HormonalProfile): {
  multiplier: number;
  proteinPerKgOverride?: number;
  note: string;
} {
  if (profile.hasAAS) {
    return {
      multiplier: 1.15,
      proteinPerKgOverride: 2.5,
      note: 'AAS suprafisiológico detectado: +15% no TMB + proteína 2,5 g/kg',
    };
  }
  if (profile.hasTRT) {
    return {
      multiplier: 1.07,
      proteinPerKgOverride: 2.2,
      note: 'TRT fisiológica: +7% no TMB + proteína 2,2 g/kg (maior massa magra)',
    };
  }
  if (profile.hasGLP1) {
    return {
      multiplier: 1.0,
      proteinPerKgOverride: 1.5,
      note: 'GLP-1/GIP: sem ajuste no TMB, mas proteína sobe para 1,5 g/kg para preservar massa (Amaro CC, UNISUL 2025)',
    };
  }
  return { multiplier: 1.0, note: '' };
}

// ─── Alertas (regras codificáveis para o dashboard) ──────────────────────────

export interface Alert {
  level: 'info' | 'warn' | 'danger';
  message: string;
  source?: string;
}

export function dietAlerts(opts: {
  kcal: number;
  weightKg: number;
  daysOnDeficit?: number;
  bodyFatPct?: number | null;
  sex: Sex;
  usingHormones?: boolean;
}): Alert[] {
  const alerts: Alert[] = [];
  const kcalPerKg = opts.kcal / opts.weightKg;

  if (kcalPerKg < 20) {
    alerts.push({
      level: 'danger',
      message: 'Calorias abaixo de 20 kcal/kg: déficit muito agressivo. Subir proteína para 2,5–3,1 g/kg para proteger massa magra.',
      source: 'Haluch — Metabolismo, pg 67',
    });
  }

  if (opts.kcal < 1500 && (opts.daysOnDeficit ?? 0) > 30 && opts.sex === 'M') {
    alerts.push({
      level: 'warn',
      message: 'Mais de 30 dias abaixo de 1500 kcal: risco de queda de testosterona livre. Considerar dosar T total + livre + E2.',
      source: 'Haluch — Testosterona (estudo Longland)',
    });
  }

  if (opts.bodyFatPct && opts.sex === 'M' && opts.bodyFatPct < 10) {
    alerts.push({
      level: 'warn',
      message: '%BF abaixo de 10%: catabolismo muscular acelerado. Considerar refeed ou diet break.',
      source: 'Haluch — Metabolismo, pg 67',
    });
  }

  if ((opts.daysOnDeficit ?? 0) > 8 * 7) {
    alerts.push({
      level: 'info',
      message: 'Mais de 8 semanas em déficit: pode ser hora de diet break (2–4 semanas em manutenção) para restaurar leptina.',
      source: 'Haluch — Estratégias, fase 2 high-carb',
    });
  }

  return alerts;
}

export function labAlerts(opts: {
  hematocrit?: number | null;
  psa?: number | null;
  testTotal?: number | null;
  estradiol?: number | null;
  ldl?: number | null;
  hdl?: number | null;
  alt?: number | null;
  ast?: number | null;
}): Alert[] {
  const a: Alert[] = [];
  if (opts.hematocrit && opts.hematocrit > 54) {
    a.push({ level: 'danger', message: `Hematócrito ${opts.hematocrit}% > 54%: gatilho para suspender TRT ou flebotomia.`, source: 'Endocrine Society / Haluch — Testosterona' });
  } else if (opts.hematocrit && opts.hematocrit > 52) {
    a.push({ level: 'warn', message: `Hematócrito ${opts.hematocrit}% acima do limite superior (52%): monitorar.` });
  }
  if (opts.psa && opts.psa > 4) {
    a.push({ level: 'danger', message: `PSA ${opts.psa} > 4: contraindicação a iniciar/continuar TRT sem urologista.`, source: 'Endocrine Society 2018' });
  }
  if (opts.testTotal && opts.testTotal < 300) {
    a.push({ level: 'warn', message: `Testosterona total ${opts.testTotal} < 300 ng/dL: confirmar com 2ª dosagem matinal antes de TRT.`, source: 'Haluch — Testosterona' });
  }
  if (opts.estradiol != null) {
    if (opts.estradiol < 10) a.push({ level: 'warn', message: `Estradiol ${opts.estradiol} pg/mL muito baixo: cuidado com AI excessivo.` });
    else if (opts.estradiol > 50) a.push({ level: 'warn', message: `Estradiol ${opts.estradiol} pg/mL elevado: pode causar retenção/ginecomastia.` });
  }
  if (opts.ldl && opts.ldl > 130) a.push({ level: 'warn', message: `LDL ${opts.ldl} mg/dL elevado.` });
  if (opts.hdl && opts.hdl < 40) a.push({ level: 'warn', message: `HDL ${opts.hdl} mg/dL baixo (AAS suprime HDL).` });
  if (opts.alt && opts.alt > 41) a.push({ level: 'warn', message: `ALT ${opts.alt} U/L elevado: monitorar fígado (atenção a orais 17-aa).` });
  if (opts.ast && opts.ast > 37) a.push({ level: 'warn', message: `AST ${opts.ast} U/L elevado.` });
  return a;
}
