// Presets de medicamentos para o tracker.
// Fontes:
//   - Haluch, "Testosterona: Fisiologia, Estética e Saúde" (2020)
//   - Santos KS et al., RBONE v.19 n.120 (2025) — tirzepatida
//   - Amaro CC, UNISUL (2025) — tirzepatida
//   - Endocrine Society Guidelines (2018) — TRT

export type MedCategory = 'glp1' | 'trt' | 'aas' | 'serm' | 'ai' | 'hcg' | 'hormone' | 'vitamin' | 'other';
export type FrequencyType = 'daily' | 'twice_daily' | 'three_daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed';

export interface MedPreset {
  name: string;
  brandName?: string;
  category: MedCategory;
  doseAmount: number;
  doseUnit: string;
  frequency: FrequencyType;
  route: string; // SC, IM, oral, transdermico
  halfLifeDays?: number;
  note?: string;
}

// ─── Tirzepatida (Mounjaro) — escalonamento oficial ──────────────────────────
// Bula Eli Lilly / ANVISA 2025 + ensaios SURPASS/SURMOUNT

export const TIRZEPATIDA_SCHEDULE = [
  { weekStart: 1,  weekEnd: 4,  dose: 2.5,  unit: 'mg', note: 'Dose de tolerância — sem efeito terapêutico pleno' },
  { weekStart: 5,  weekEnd: 8,  dose: 5.0,  unit: 'mg', note: 'Primeira dose com eficácia mensurável' },
  { weekStart: 9,  weekEnd: 12, dose: 7.5,  unit: 'mg', note: 'Dose intermediária' },
  { weekStart: 13, weekEnd: 16, dose: 10.0, unit: 'mg', note: 'Dose de manutenção comum' },
  { weekStart: 17, weekEnd: 20, dose: 12.5, unit: 'mg', note: 'Escalonamento pré-dose máxima' },
  { weekStart: 21, weekEnd: null, dose: 15.0, unit: 'mg', note: 'Dose máxima; maior eficácia em estudos de 72–88 sem' },
];

export const TIRZEPATIDA_EFFICACY = {
  '5mg':  { weightLossPct: [5, 15],  peakWeeks: 40,  note: 'SURPASS-3: ~10,3% em 52 sem' },
  '10mg': { weightLossPct: [6, 19],  peakWeeks: 52,  note: 'SURMOUNT-1' },
  '15mg': { weightLossPct: [6, 25],  peakWeeks: 72,  note: 'SURMOUNT-4: 89,5% mantiveram ≥80% da perda; Aronne 2024: 25,3% em 88 sem' },
};

// ─── Presets de medicamentos (seleção rápida no cadastro) ────────────────────

export const MED_PRESETS: MedPreset[] = [
  // GLP-1 / GIP
  {
    name: 'Tirzepatida',
    brandName: 'Mounjaro',
    category: 'glp1',
    doseAmount: 2.5,
    doseUnit: 'mg',
    frequency: 'weekly',
    route: 'SC',
    note: 'Iniciar em 2,5 mg e escalar a cada 4 semanas conforme tolerância',
  },
  {
    name: 'Semaglutida',
    brandName: 'Ozempic / Wegovy',
    category: 'glp1',
    doseAmount: 0.5,
    doseUnit: 'mg',
    frequency: 'weekly',
    route: 'SC',
    note: 'Iniciar em 0,25 mg por 4 sem → 0,5 mg → 1 mg → 2 mg',
  },
  // TRT
  {
    name: 'Cipionato de Testosterona',
    brandName: 'Deposteron',
    category: 'trt',
    doseAmount: 200,
    doseUnit: 'mg',
    frequency: 'weekly',
    route: 'IM',
    halfLifeDays: 8,
    note: 'TRT: 100–200 mg/sem. Supra: até 600 mg. Meia-vida ~8 dias.',
  },
  {
    name: 'Enantato de Testosterona',
    brandName: 'Testoviron Depot',
    category: 'trt',
    doseAmount: 250,
    doseUnit: 'mg',
    frequency: 'weekly',
    route: 'IM',
    halfLifeDays: 7,
    note: 'TRT: 100–250 mg/sem. Meia-vida ~5–8 dias.',
  },
  {
    name: 'Propionato de Testosterona',
    category: 'trt',
    doseAmount: 100,
    doseUnit: 'mg',
    frequency: 'three_daily', // EOD
    route: 'IM',
    halfLifeDays: 1.5,
    note: 'Aplicação a cada 2 dias (meia-vida 1–2 dias). Menos confortável.',
  },
  {
    name: 'Undecanoato de Testosterona',
    brandName: 'Nebido',
    category: 'trt',
    doseAmount: 1000,
    doseUnit: 'mg',
    frequency: 'monthly', // na prática q10-14sem
    route: 'IM',
    halfLifeDays: 20,
    note: 'Aplicação a cada 10–14 semanas após dose de carga. Meia-vida ~20 dias.',
  },
  {
    name: 'Testosterona em Gel 1%',
    brandName: 'Androgel',
    category: 'trt',
    doseAmount: 5,
    doseUnit: 'g',
    frequency: 'daily',
    route: 'transdermico',
    note: '5–10 g/dia (50–100 mg; biodisponibilidade ~10%). Aplicar ombros/abdome.',
  },
  {
    name: 'Durateston (Blend 250 mg)',
    brandName: 'Durateston',
    category: 'trt',
    doseAmount: 250,
    doseUnit: 'mg',
    frequency: 'biweekly',
    route: 'IM',
    halfLifeDays: 18,
    note: 'Blend propionato+fenilpropionato+isocaproato+decanoato. TRT: q2-3sem. Estético: q1-2sem.',
  },
  // SERMs
  {
    name: 'Clomifeno',
    brandName: 'Clomid',
    category: 'serm',
    doseAmount: 50,
    doseUnit: 'mg',
    frequency: 'daily',
    route: 'oral',
    note: '25–100 mg/dia. TPC ou estimulação endógena de testosterona.',
  },
  {
    name: 'Tamoxifeno',
    brandName: 'Nolvadex',
    category: 'serm',
    doseAmount: 20,
    doseUnit: 'mg',
    frequency: 'daily',
    route: 'oral',
    note: '20–40 mg/dia. Tratamento de ginecomastia ou TPC pós-ciclo.',
  },
  // AIs
  {
    name: 'Anastrozol',
    brandName: 'Arimidex',
    category: 'ai',
    doseAmount: 1,
    doseUnit: 'mg',
    frequency: 'daily',
    route: 'oral',
    note: '0,5–1 mg/dia. Inibidor de aromatase; controle de estradiol em TRT.',
  },
  {
    name: 'Exemestano',
    brandName: 'Aromasin',
    category: 'ai',
    doseAmount: 25,
    doseUnit: 'mg',
    frequency: 'daily',
    route: 'oral',
    note: 'AI esteroidal. 25 mg/dia ou alternado.',
  },
  // hCG
  {
    name: 'hCG (Gonadotrofina Coriônica)',
    brandName: 'Pregnyl / Ovidrel',
    category: 'hcg',
    doseAmount: 500,
    doseUnit: 'UI',
    frequency: 'twice_daily', // na prática 2-3x/sem
    route: 'SC',
    note: 'Manutenção: 250–500 UI, 2–3×/sem. Resgate de fertilidade: 3000 UI/48h.',
  },
  // Levotiroxina
  {
    name: 'Levotiroxina',
    brandName: 'Puran T4',
    category: 'hormone',
    doseAmount: 50,
    doseUnit: 'mcg',
    frequency: 'daily',
    route: 'oral',
    note: 'Tomar em jejum, 30 min antes do café. Dose varia conforme TSH alvo.',
  },
  // Cabergolina
  {
    name: 'Cabergolina',
    brandName: 'Dostinex',
    category: 'other',
    doseAmount: 0.5,
    doseUnit: 'mg',
    frequency: 'weekly',
    route: 'oral',
    note: '0,5 mg, 1–2×/sem. Controle de prolactina em usuários de nandrolona/trembolona.',
  },
];

// ─── Catálogo de efeitos colaterais para dropdown ────────────────────────────

export const SIDE_EFFECTS_CATALOG = {
  gastrointestinal: [
    'nausea',
    'vomito',
    'diarreia',
    'constipacao',
    'dor_abdominal',
    'dispepsia',
    'refluxo',
    'flatulencia',
    'arroto_excessivo',
  ],
  cardiovascular: [
    'retencao_hidrica',
    'aumento_pressao_arterial',
    'taquicardia',
    'arritmia',
    'hipertrofia_ventricular',
  ],
  hormonal: [
    'ginecomastia',
    'atrofia_testicular',
    'infertilidade_temporaria',
    'baixa_libido_pos_ciclo',
    'disfuncao_eretil',
    'estradiol_baixo',
    'estradiol_elevado',
    'aumento_prolactina',
  ],
  metabolico: [
    'hematocrito_elevado',
    'eritrocitose',
    'reducao_hdl',
    'aumento_ldl',
    'hipoglicemia',
    'aumento_glicose',
  ],
  cabelo_pele: [
    'acne',
    'oleosidade_pele',
    'queda_cabelo',
    'alopecia',
  ],
  hepatico: [
    'aumento_ast_tgo',
    'aumento_alt_tgp',
    'aumento_ggt',
  ],
  mental: [
    'irritabilidade',
    'agressividade',
    'ansiedade',
    'depressao',
    'insonia',
    'oscilacao_humor',
    'fadiga',
    'tontura',
  ],
  prostatico: [
    'aumento_psa',
    'hipertrofia_prostatica',
  ],
  outro: [
    'dor_local_aplicacao',
    'apneia_do_sono',
    'suores_noturnos',
    'edema_pernas',
    'ruptura_tendao',
    'alteracao_paladar',
    'reacao_alergica',
  ],
} as const;

// Labels em português para exibição
export const SIDE_EFFECT_LABELS: Record<string, string> = {
  nausea: 'Náusea',
  vomito: 'Vômito',
  diarreia: 'Diarreia',
  constipacao: 'Constipação (prisão de ventre)',
  dor_abdominal: 'Dor/desconforto abdominal',
  dispepsia: 'Azia / indigestão',
  refluxo: 'Refluxo gastroesofágico',
  flatulencia: 'Flatulência',
  arroto_excessivo: 'Arroto excessivo',
  retencao_hidrica: 'Retenção hídrica / inchaço',
  aumento_pressao_arterial: 'Pressão arterial elevada',
  taquicardia: 'Taquicardia',
  arritmia: 'Arritmia',
  hipertrofia_ventricular: 'Hipertrofia ventricular esquerda',
  ginecomastia: 'Ginecomastia',
  atrofia_testicular: 'Atrofia testicular',
  infertilidade_temporaria: 'Infertilidade temporária / azoospermia',
  baixa_libido_pos_ciclo: 'Baixa libido pós-ciclo',
  disfuncao_eretil: 'Disfunção erétil',
  estradiol_baixo: 'Estradiol baixo (anastrozol excessivo)',
  estradiol_elevado: 'Estradiol elevado',
  aumento_prolactina: 'Prolactina elevada',
  hematocrito_elevado: 'Hematócrito elevado',
  eritrocitose: 'Eritrocitose (hematócrito > 54%)',
  reducao_hdl: 'Redução de HDL',
  aumento_ldl: 'Aumento de LDL',
  hipoglicemia: 'Hipoglicemia',
  aumento_glicose: 'Glicose elevada',
  acne: 'Acne',
  oleosidade_pele: 'Pele oleosa',
  queda_cabelo: 'Queda de cabelo',
  alopecia: 'Alopecia (queda transitória)',
  aumento_ast_tgo: 'Aumento de TGO (AST)',
  aumento_alt_tgp: 'Aumento de TGP (ALT)',
  aumento_ggt: 'Aumento de GGT',
  irritabilidade: 'Irritabilidade',
  agressividade: 'Agressividade',
  ansiedade: 'Ansiedade',
  depressao: 'Humor deprimido',
  insonia: 'Insônia',
  oscilacao_humor: 'Oscilação de humor',
  fadiga: 'Fadiga / cansaço',
  tontura: 'Tontura',
  aumento_psa: 'PSA elevado',
  hipertrofia_prostatica: 'Hipertrofia prostática',
  dor_local_aplicacao: 'Dor no local da injeção',
  apneia_do_sono: 'Apneia do sono',
  suores_noturnos: 'Suores noturnos',
  edema_pernas: 'Edema nas pernas',
  ruptura_tendao: 'Ruptura de tendão',
  alteracao_paladar: 'Alteração do paladar',
  reacao_alergica: 'Reação alérgica',
};

// ─── Valores de referência de exames ────────────────────────────────────────

export interface LabRef {
  label: string;
  unit: string;
  refMin?: number;
  refMax?: number;
  alertMin?: number;  // abaixo disso → warn/danger
  alertMax?: number;  // acima disso → warn/danger
  alertLevel?: 'warn' | 'danger';
  note?: string;
}

export const LAB_REFERENCES: Record<string, LabRef> = {
  testTotal:      { label: 'Testosterona Total', unit: 'ng/dL',  refMin: 250, refMax: 1000, alertMin: 300, alertMax: 1200 },
  testFree:       { label: 'Testosterona Livre', unit: 'pg/mL',  refMin: 50,  refMax: 210 },
  estradiol:      { label: 'Estradiol (E2)',     unit: 'pg/mL',  refMin: 10,  refMax: 50,  alertMin: 10, alertMax: 50 },
  dht:            { label: 'DHT',               unit: 'ng/dL',  refMin: 25,  refMax: 100 },
  lh:             { label: 'LH',                unit: 'UI/L',   refMin: 1.2, refMax: 7.8 },
  fsh:            { label: 'FSH',               unit: 'UI/L',   refMin: 1.4, refMax: 15.4 },
  prolactin:      { label: 'Prolactina',        unit: 'ng/mL',  refMin: 3,   refMax: 14.7 },
  shbg:           { label: 'SHBG',              unit: 'nmol/L', refMin: 13.2,refMax: 89.5 },
  hematocrit:     { label: 'Hematócrito',       unit: '%',      refMin: 42,  refMax: 52, alertMax: 54, alertLevel: 'danger', note: 'Acima de 54%: gatilho para suspender TRT ou flebotomia' },
  psa:            { label: 'PSA',               unit: 'ng/mL',  refMax: 4,   alertMax: 4,  alertLevel: 'danger', note: 'PSA > 4: contraindicação a iniciar/continuar TRT sem urologista' },
  glucoseFasting:  { label: 'Glicose Jejum',    unit: 'mg/dL',  refMin: 70,  refMax: 99,  alertMin: 70, alertMax: 126 },
  insulinFasting:  { label: 'Insulina Jejum',   unit: 'µU/mL', refMax: 4, note: '< 4 = boa sensibilidade à insulina' },
  hba1c:          { label: 'HbA1c',             unit: '%',      refMax: 5.7, alertMax: 7.0, note: 'Alvo < 7% para DM2; < 5,7% em não-diabético' },
  totalChol:      { label: 'Colesterol Total',  unit: 'mg/dL',  refMax: 200 },
  ldl:            { label: 'LDL',               unit: 'mg/dL',  refMax: 100, alertMax: 130 },
  hdl:            { label: 'HDL',               unit: 'mg/dL',  refMin: 40,  alertMin: 40 },
  triglycerides:  { label: 'Triglicerídeos',    unit: 'mg/dL',  refMax: 150, alertMax: 200 },
  ast:            { label: 'TGO (AST)',          unit: 'U/L',    refMax: 37,  alertMax: 50, note: 'Atenção com orais 17-aa' },
  alt:            { label: 'TGP (ALT)',          unit: 'U/L',    refMax: 41,  alertMax: 55 },
  ggt:            { label: 'GGT',               unit: 'U/L',    refMin: 12,  refMax: 73 },
  creatinine:     { label: 'Creatinina',        unit: 'mg/dL',  refMin: 0.6, refMax: 1.3 },
  tsh:            { label: 'TSH',               unit: 'mUI/L',  refMin: 0.4, refMax: 4.0 },
  t4Free:         { label: 'T4 Livre',          unit: 'ng/dL',  refMin: 0.8, refMax: 1.8 },
};

// ─── Alertas automáticos para tirzepatida ────────────────────────────────────

export const TIRZEPATIDA_ALERTS = [
  { trigger: 'vomito', message: 'Vômitos registrados: mantenha hidratação (2L água/dia). Se persistir >24h, consulte seu médico antes da próxima dose.' },
  { trigger: 'constipacao', message: 'Constipação: aumente consumo de fibras (meta: 25–30g/dia). Aveia, leguminosas, chia e vegetais ajudam.' },
  { trigger: 'nausea', message: 'Náusea intensa: não escale a dose ainda. Refeições menores e com baixo teor de gordura ajudam.' },
  { trigger: 'taquicardia', message: 'Taquicardia registrada: informe seu médico antes da próxima aplicação.' },
  { trigger: 'hipoglicemia', message: 'Hipoglicemia: revise se usa insulina ou sulfonilureia junto. Monitore glicose com mais frequência.' },
];

// ─── Disclaimer legal para exibir ao cadastrar TRT/AAS/GLP-1 ─────────────────

export const MED_DISCLAIMERS: Record<MedCategory, string> = {
  glp1: 'Medicamento de prescrição com retenção de receita (ANVISA). Use apenas com acompanhamento médico. Contraindicado em: histórico de carcinoma medular de tireoide, NEM2, pancreatite, gravidez. Este app não substitui orientação médica.',
  trt: 'Terapia de reposição hormonal é procedimento médico. Requer 2 dosagens matinais de testosterona + avaliação clínica antes de iniciar. Exames periódicos obrigatórios (hematócrito, PSA, lipídeos). Este app é apenas um tracker — não é prescrição.',
  aas: 'Uso de esteroides anabolizantes fora de indicação médica é ilegal no Brasil. O app registra informações para acompanhamento de saúde do usuário. Sempre realize exames laboratoriais periódicos.',
  serm: 'SERMs (tamoxifeno, clomifeno) são medicamentos de prescrição. Use apenas com orientação médica.',
  ai: 'Inibidores de aromatase podem causar queda excessiva de estradiol. Monitore E2 regularmente. Não use sem orientação médica.',
  hcg: 'hCG é prescrito para fins de fertilidade ou como adjuvante em TRT. Use com acompanhamento médico.',
  hormone: 'Este medicamento hormonal requer prescrição médica e monitoramento laboratorial periódico.',
  vitamin: '',
  other: 'Consulte seu médico ou farmacêutico antes de usar.',
};
