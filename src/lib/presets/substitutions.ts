// Tabela de equivalência entre alimentos.
// Fonte: calculada a partir das tabelas TACO publicadas em:
//   Haluch, "Estratégias Nutricionais para Definição Muscular", 2019.
// Formato: para N gramas de foodA → M gramas de foodB mantendo a `basis` igual.

export interface SubstitutionPair {
  foodAExternalId: string;
  foodAName: string;
  foodBExternalId: string;
  foodBName: string;
  gramsA: number;
  gramsB: number;
  basis: 'kcal' | 'protein' | 'carb';
  note?: string;
}

export const SUBSTITUTION_PAIRS: SubstitutionPair[] = [
  // ─── Carboidratos — equivalência por 28 g de carbo (= 100g arroz branco) ──

  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T020', foodBName: 'Arroz integral cozido',    gramsA: 100, gramsB: 109, basis: 'carb', note: 'Integral tem mais fibra e índice glicêmico menor' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T021', foodBName: 'Batata-doce cozida',       gramsA: 100, gramsB: 153, basis: 'carb', note: 'Batata-doce: mais vitamina A, mais saciante' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T022', foodBName: 'Batata-inglesa cozida',    gramsA: 100, gramsB: 236, basis: 'carb', note: 'Batata inglesa: volume alto, bom pra cutting' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T023', foodBName: 'Inhame cozido',            gramsA: 100, gramsB: 106, basis: 'carb' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T024', foodBName: 'Mandioca cozida',          gramsA: 100, gramsB: 93,  basis: 'carb' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T027', foodBName: 'Aveia em flocos',          gramsA: 100, gramsB: 42,  basis: 'carb', note: 'Aveia: muito mais fibra e proteína' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T043', foodBName: 'Banana nanica crua',       gramsA: 100, gramsB: 118, basis: 'carb', note: 'Banana: mais potássio; cuidado com kcal extras' },
  { foodAExternalId: 'T019', foodAName: 'Arroz branco cozido',    foodBExternalId: 'T040', foodBName: 'Maçã fuji crua',           gramsA: 100, gramsB: 184, basis: 'carb', note: 'Maçã: mais fibra, menor densidade calórica' },

  // ─── Frutas — equivalência por ~24g carbo (= 100g banana) ─────────────────
  { foodAExternalId: 'T043', foodAName: 'Banana nanica crua',     foodBExternalId: 'T035', foodBName: 'Melancia crua',            gramsA: 100, gramsB: 296, basis: 'carb', note: 'Melancia: excelente para cutting, altamente saciante pelo volume' },
  { foodAExternalId: 'T043', foodAName: 'Banana nanica crua',     foodBExternalId: 'T036', foodBName: 'Melão cru',                gramsA: 100, gramsB: 317, basis: 'carb' },
  { foodAExternalId: 'T043', foodAName: 'Banana nanica crua',     foodBExternalId: 'T037', foodBName: 'Morango cru',              gramsA: 100, gramsB: 350, basis: 'carb' },
  { foodAExternalId: 'T043', foodAName: 'Banana nanica crua',     foodBExternalId: 'T038', foodBName: 'Abacaxi cru',              gramsA: 100, gramsB: 194, basis: 'carb' },
  { foodAExternalId: 'T043', foodAName: 'Banana nanica crua',     foodBExternalId: 'T039', foodBName: 'Mamão papaia cru',         gramsA: 100, gramsB: 229, basis: 'carb' },

  // ─── Proteínas — equivalência por 32 g de proteína (= 100g frango grelhado)

  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T011', foodBName: 'Tilápia grelhada',         gramsA: 100, gramsB: 123, basis: 'protein', note: 'Tilápia: menos gordura, mais leve' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T009', foodBName: 'Atum em água (lata)',       gramsA: 100, gramsB: 147, basis: 'protein', note: 'Atum: prático, rico em ômega-3' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T004', foodBName: 'Patinho grelhado',          gramsA: 100, gramsB: 89,  basis: 'protein', note: 'Patinho: mais ferro, mais kcal' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T005', foodBName: 'Filé mignon grelhado',     gramsA: 100, gramsB: 98,  basis: 'protein', note: 'Mais gordura — considerar nas kcal totais' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T008', foodBName: 'Lombo de porco grelhado',   gramsA: 100, gramsB: 90,  basis: 'protein' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T012', foodBName: 'Salmão grelhado',          gramsA: 100, gramsB: 123, basis: 'protein', note: 'Salmão: muito mais gordo — ~2× as kcal do frango' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T010', foodBName: 'Sardinha em óleo',         gramsA: 100, gramsB: 99,  basis: 'protein', note: 'Sardinha: cálcio + ferro excelentes' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T014', foodBName: 'Clara de ovo crua',        gramsA: 100, gramsB: 296, basis: 'protein', note: '≈ 10 claras; opção de baixo custo e zero gordura' },
  { foodAExternalId: 'T001', foodAName: 'Frango filé grelhado',   foodBExternalId: 'T013', foodBName: 'Ovo inteiro cozido',       gramsA: 100, gramsB: 241, basis: 'protein', note: '≈ 4 ovos; atenção à gordura dos gremas' },

  // ─── Whey → real food ─────────────────────────────────────────────────────
  { foodAExternalId: 'T018', foodAName: 'Whey protein (30g)',      foodBExternalId: 'T001', foodBName: 'Frango filé grelhado',     gramsA: 30,  gramsB: 75,  basis: 'protein' },
  { foodAExternalId: 'T018', foodAName: 'Whey protein (30g)',      foodBExternalId: 'T014', foodBName: 'Clara de ovo crua',        gramsA: 30,  gramsB: 222, basis: 'protein', note: '≈ 7 claras' },

  // ─── Gorduras boas — equivalência por ~15 g de gordura ───────────────────
  { foodAExternalId: 'T044', foodAName: 'Abacate (100g)',          foodBExternalId: 'T062', foodBName: 'Amendoim torrado',          gramsA: 100, gramsB: 17,  basis: 'kcal', note: 'Amendoim: mais proteína, menos fibra' },
  { foodAExternalId: 'T044', foodAName: 'Abacate (100g)',          foodBExternalId: 'T064', foodBName: 'Castanha-do-pará',          gramsA: 100, gramsB: 15,  basis: 'kcal' },
  { foodAExternalId: 'T061', foodAName: 'Azeite de oliva (15ml)',  foodBExternalId: 'T063', foodBName: 'Amêndoas cruas',            gramsA: 15,  gramsB: 24,  basis: 'kcal' },
];
