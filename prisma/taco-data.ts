// Base TACO — valores por 100g.
// Fontes: TACO 4ª ed. (UNICAMP) + tabelas do livro "Estratégias Nutricionais" (Haluch, 2019).
// Cobre os alimentos mais usados em protocolos de cutting/definição.

export interface TacoFood {
  externalId: string;
  source: 'TACO';
  name: string;
  category: string;
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitC?: number;
  servingLabel?: string;
  servingGrams?: number;
}

export const TACO_FOODS: TacoFood[] = [
  // ─── PROTEÍNAS ANIMAIS ────────────────────────────────────────────────────
  { externalId: 'T001', source: 'TACO', name: 'Frango, filé, grelhado', category: 'Carne e derivados', kcal: 159, protein: 32.0, carb: 0, fat: 3.0, sodium: 73, servingLabel: '100g', servingGrams: 100 },
  { externalId: 'T002', source: 'TACO', name: 'Frango, peito, sem pele, cru', category: 'Carne e derivados', kcal: 119, protein: 22.4, carb: 0, fat: 2.9, sodium: 58 },
  { externalId: 'T003', source: 'TACO', name: 'Frango, coxa e sobrecoxa, assado', category: 'Carne e derivados', kcal: 226, protein: 26.0, carb: 0, fat: 13.4 },
  { externalId: 'T004', source: 'TACO', name: 'Boi, patinho, grelhado', category: 'Carne e derivados', kcal: 219, protein: 35.9, carb: 0, fat: 7.3, sodium: 66 },
  { externalId: 'T005', source: 'TACO', name: 'Boi, filé mignon, grelhado', category: 'Carne e derivados', kcal: 220, protein: 32.8, carb: 0, fat: 8.8, sodium: 55 },
  { externalId: 'T006', source: 'TACO', name: 'Boi, alcatra, grelhada', category: 'Carne e derivados', kcal: 241, protein: 31.9, carb: 0, fat: 11.6 },
  { externalId: 'T007', source: 'TACO', name: 'Boi, coxão mole, cru', category: 'Carne e derivados', kcal: 136, protein: 20.1, carb: 0, fat: 5.5 },
  { externalId: 'T008', source: 'TACO', name: 'Suíno, lombo, grelhado', category: 'Carne e derivados', kcal: 210, protein: 35.7, carb: 0, fat: 6.4 },
  { externalId: 'T009', source: 'TACO', name: 'Atum, em água, enlatado', category: 'Peixes e frutos do mar', kcal: 98, protein: 21.8, carb: 0, fat: 0.9, sodium: 360 },
  { externalId: 'T010', source: 'TACO', name: 'Sardinha, em óleo, enlatada', category: 'Peixes e frutos do mar', kcal: 164, protein: 32.2, carb: 0, fat: 3.0, calcium: 383, iron: 3.9 },
  { externalId: 'T011', source: 'TACO', name: 'Tilápia, filé, grelhado', category: 'Peixes e frutos do mar', kcal: 129, protein: 26.0, carb: 0, fat: 2.7 },
  { externalId: 'T012', source: 'TACO', name: 'Salmão, grelhado', category: 'Peixes e frutos do mar', kcal: 243, protein: 26.1, carb: 0, fat: 14.5 },
  { externalId: 'T013', source: 'TACO', name: 'Ovo de galinha, inteiro, cozido', category: 'Ovos e derivados', kcal: 146, protein: 13.3, carb: 0.6, fat: 9.5, sodium: 158, servingLabel: '1 unidade (50g)', servingGrams: 50 },
  { externalId: 'T014', source: 'TACO', name: 'Ovo de galinha, clara, crua', category: 'Ovos e derivados', kcal: 52, protein: 10.8, carb: 0.7, fat: 0.2, sodium: 154, servingLabel: '1 clara (30g)', servingGrams: 30 },
  { externalId: 'T015', source: 'TACO', name: 'Queijo cottage', category: 'Leite e derivados', kcal: 97, protein: 12.6, carb: 3.4, fat: 3.8, calcium: 69, sodium: 405, servingLabel: '2 colheres sopa (100g)', servingGrams: 100 },
  { externalId: 'T016', source: 'TACO', name: 'Iogurte natural desnatado', category: 'Leite e derivados', kcal: 47, protein: 4.9, carb: 7.0, fat: 0.2, calcium: 150, servingLabel: '1 pote (170g)', servingGrams: 170 },
  { externalId: 'T017', source: 'TACO', name: 'Leite desnatado', category: 'Leite e derivados', kcal: 35, protein: 3.5, carb: 5.0, fat: 0.1, calcium: 124 },
  { externalId: 'T018', source: 'TACO', name: 'Whey protein concentrado (ref.)', category: 'Suplementos', kcal: 380, protein: 75.0, carb: 7.5, fat: 5.0, servingLabel: '1 scoop (30g)', servingGrams: 30 },

  // ─── CARBOIDRATOS COMPLEXOS ───────────────────────────────────────────────
  { externalId: 'T019', source: 'TACO', name: 'Arroz, branco, cozido', category: 'Cereais e derivados', kcal: 128, protein: 2.5, carb: 28.1, fat: 0.2, fiber: 1.6, servingLabel: '4 colheres sopa (100g)', servingGrams: 100 },
  { externalId: 'T020', source: 'TACO', name: 'Arroz, integral, cozido', category: 'Cereais e derivados', kcal: 124, protein: 2.7, carb: 25.8, fat: 1.0, fiber: 2.7, servingLabel: '4 colheres sopa (100g)', servingGrams: 100 },
  { externalId: 'T021', source: 'TACO', name: 'Batata-doce, cozida', category: 'Tubérculos e raízes', kcal: 77, protein: 1.4, carb: 18.3, fat: 0.1, fiber: 2.2, potassium: 397, vitC: 19.6, servingLabel: '1 unidade média (150g)', servingGrams: 150 },
  { externalId: 'T022', source: 'TACO', name: 'Batata-inglesa, cozida', category: 'Tubérculos e raízes', kcal: 52, protein: 1.2, carb: 11.9, fat: 0.1, fiber: 1.2, potassium: 328, servingLabel: '1 unidade média (140g)', servingGrams: 140 },
  { externalId: 'T023', source: 'TACO', name: 'Inhame, cozido', category: 'Tubérculos e raízes', kcal: 116, protein: 2.8, carb: 26.5, fat: 0.2, fiber: 3.9 },
  { externalId: 'T024', source: 'TACO', name: 'Mandioca, cozida', category: 'Tubérculos e raízes', kcal: 125, protein: 0.6, carb: 30.1, fat: 0.3, fiber: 1.9 },
  { externalId: 'T025', source: 'TACO', name: 'Macarrão, integral, cozido', category: 'Cereais e derivados', kcal: 123, protein: 4.9, carb: 24.9, fat: 0.8, fiber: 2.8 },
  { externalId: 'T026', source: 'TACO', name: 'Macarrão, grano duro, cozido', category: 'Cereais e derivados', kcal: 131, protein: 4.7, carb: 27.1, fat: 0.5, fiber: 1.7 },
  { externalId: 'T027', source: 'TACO', name: 'Aveia, flocos, crua', category: 'Cereais e derivados', kcal: 394, protein: 13.9, carb: 67.2, fat: 8.5, fiber: 9.1, servingLabel: '3 colheres sopa (30g)', servingGrams: 30 },
  { externalId: 'T028', source: 'TACO', name: 'Pão integral', category: 'Panificados', kcal: 243, protein: 9.4, carb: 44.2, fat: 3.5, fiber: 6.6, servingLabel: '1 fatia (25g)', servingGrams: 25 },
  { externalId: 'T029', source: 'TACO', name: 'Tapioca, hidratada', category: 'Cereais e derivados', kcal: 350, protein: 0.2, carb: 88.0, fat: 0.2, servingLabel: '1 wrap (60g)', servingGrams: 60 },

  // ─── LEGUMINOSAS ──────────────────────────────────────────────────────────
  { externalId: 'T030', source: 'TACO', name: 'Feijão carioca, cozido', category: 'Leguminosas', kcal: 76, protein: 4.8, carb: 13.6, fat: 0.5, fiber: 8.5, iron: 1.8, servingLabel: '1 concha (100g)', servingGrams: 100 },
  { externalId: 'T031', source: 'TACO', name: 'Feijão preto, cozido', category: 'Leguminosas', kcal: 77, protein: 4.5, carb: 14.0, fat: 0.5, fiber: 8.4 },
  { externalId: 'T032', source: 'TACO', name: 'Lentilha, cozida', category: 'Leguminosas', kcal: 93, protein: 6.3, carb: 16.3, fat: 0.5, fiber: 7.9, iron: 3.3 },
  { externalId: 'T033', source: 'TACO', name: 'Grão-de-bico, cozido', category: 'Leguminosas', kcal: 129, protein: 8.9, carb: 21.4, fat: 2.0, fiber: 7.6, iron: 3.1 },
  { externalId: 'T034', source: 'TACO', name: 'Ervilha, cozida', category: 'Leguminosas', kcal: 74, protein: 4.6, carb: 13.4, fat: 0.2, fiber: 5.1 },

  // ─── FRUTAS (cutting-friendly em destaque) ────────────────────────────────
  { externalId: 'T035', source: 'TACO', name: 'Melancia, crua', category: 'Frutas', kcal: 33, protein: 0.6, carb: 8.1, fat: 0.1, fiber: 0.3, vitC: 7.7, servingLabel: '1 fatia (200g)', servingGrams: 200 },
  { externalId: 'T036', source: 'TACO', name: 'Melão, cru', category: 'Frutas', kcal: 29, protein: 0.7, carb: 7.5, fat: 0.1, fiber: 0.3, vitC: 18.0 },
  { externalId: 'T037', source: 'TACO', name: 'Morango, cru', category: 'Frutas', kcal: 30, protein: 0.8, carb: 6.8, fat: 0.3, fiber: 1.7, vitC: 57.5, servingLabel: '1 xícara (150g)', servingGrams: 150 },
  { externalId: 'T038', source: 'TACO', name: 'Abacaxi, cru', category: 'Frutas', kcal: 48, protein: 0.9, carb: 12.3, fat: 0.1, fiber: 1.0, vitC: 36.2 },
  { externalId: 'T039', source: 'TACO', name: 'Mamão papaia, cru', category: 'Frutas', kcal: 40, protein: 0.5, carb: 10.4, fat: 0.1, fiber: 1.8, vitC: 72.9, servingLabel: '1 fatia média (100g)', servingGrams: 100 },
  { externalId: 'T040', source: 'TACO', name: 'Maçã fuji, crua', category: 'Frutas', kcal: 56, protein: 0.3, carb: 15.2, fat: 0.1, fiber: 1.5, vitC: 7.0, servingLabel: '1 unidade (150g)', servingGrams: 150 },
  { externalId: 'T041', source: 'TACO', name: 'Pera, crua', category: 'Frutas', kcal: 53, protein: 0.5, carb: 14.0, fat: 0.1, fiber: 3.0, vitC: 3.8 },
  { externalId: 'T042', source: 'TACO', name: 'Laranja pêra, crua', category: 'Frutas', kcal: 37, protein: 1.0, carb: 8.9, fat: 0.1, fiber: 0.8, vitC: 53.0, servingLabel: '1 unidade (130g)', servingGrams: 130 },
  { externalId: 'T043', source: 'TACO', name: 'Banana nanica, crua', category: 'Frutas', kcal: 92, protein: 1.3, carb: 23.8, fat: 0.1, fiber: 1.9, potassium: 376, servingLabel: '1 unidade (80g)', servingGrams: 80 },
  { externalId: 'T044', source: 'TACO', name: 'Abacate, cru', category: 'Frutas', kcal: 96, protein: 1.2, carb: 6.0, fat: 8.4, fiber: 6.3, servingLabel: 'Meio abacate (100g)', servingGrams: 100 },
  { externalId: 'T045', source: 'TACO', name: 'Kiwi, cru', category: 'Frutas', kcal: 51, protein: 1.1, carb: 11.5, fat: 0.5, fiber: 2.7, vitC: 92.7 },
  { externalId: 'T046', source: 'TACO', name: 'Uva Itália, crua', category: 'Frutas', kcal: 68, protein: 0.9, carb: 17.6, fat: 0.3, fiber: 0.9 },

  // ─── VEGETAIS LIVRES ──────────────────────────────────────────────────────
  { externalId: 'T047', source: 'TACO', name: 'Alface crespa, crua', category: 'Verduras e hortaliças', kcal: 11, protein: 1.3, carb: 1.7, fat: 0.2, fiber: 1.8, vitC: 18.0 },
  { externalId: 'T048', source: 'TACO', name: 'Rúcula, crua', category: 'Verduras e hortaliças', kcal: 13, protein: 1.7, carb: 0.8, fat: 0.4, fiber: 1.6, calcium: 160 },
  { externalId: 'T049', source: 'TACO', name: 'Brócolis, cozido', category: 'Verduras e hortaliças', kcal: 25, protein: 2.9, carb: 3.1, fat: 0.4, fiber: 2.6, vitC: 42.0, calcium: 45 },
  { externalId: 'T050', source: 'TACO', name: 'Couve-flor, cozida', category: 'Verduras e hortaliças', kcal: 19, protein: 1.9, carb: 2.8, fat: 0.2, fiber: 2.2 },
  { externalId: 'T051', source: 'TACO', name: 'Espinafre, cru', category: 'Verduras e hortaliças', kcal: 22, protein: 2.9, carb: 0.4, fat: 0.4, fiber: 2.0, iron: 2.7, calcium: 99 },
  { externalId: 'T052', source: 'TACO', name: 'Tomate, cru', category: 'Verduras e hortaliças', kcal: 15, protein: 1.1, carb: 2.9, fat: 0.2, fiber: 1.2, vitC: 21.9, potassium: 222 },
  { externalId: 'T053', source: 'TACO', name: 'Cenoura, crua', category: 'Verduras e hortaliças', kcal: 34, protein: 1.3, carb: 7.7, fat: 0.2, fiber: 3.2, vitC: 4.0 },
  { externalId: 'T054', source: 'TACO', name: 'Beterraba, cozida', category: 'Verduras e hortaliças', kcal: 32, protein: 1.1, carb: 7.6, fat: 0.1, fiber: 1.9 },
  { externalId: 'T055', source: 'TACO', name: 'Cebola, crua', category: 'Verduras e hortaliças', kcal: 39, protein: 1.2, carb: 9.2, fat: 0.1, fiber: 1.7, vitC: 6.4 },
  { externalId: 'T056', source: 'TACO', name: 'Abobrinha italiana, crua', category: 'Verduras e hortaliças', kcal: 14, protein: 1.5, carb: 1.6, fat: 0.3, fiber: 0.9 },
  { externalId: 'T057', source: 'TACO', name: 'Pepino japonês, cru', category: 'Verduras e hortaliças', kcal: 10, protein: 0.7, carb: 1.5, fat: 0.1, fiber: 0.7 },
  { externalId: 'T058', source: 'TACO', name: 'Pimentão vermelho, cru', category: 'Verduras e hortaliças', kcal: 28, protein: 1.1, carb: 6.3, fat: 0.3, fiber: 2.1, vitC: 139.0 },
  { externalId: 'T059', source: 'TACO', name: 'Couve-manteiga, crua', category: 'Verduras e hortaliças', kcal: 25, protein: 3.0, carb: 2.7, fat: 0.7, fiber: 2.0, calcium: 294, iron: 1.1 },
  { externalId: 'T060', source: 'TACO', name: 'Agrião, cru', category: 'Verduras e hortaliças', kcal: 17, protein: 2.5, carb: 1.4, fat: 0.2, fiber: 1.3 },

  // ─── GORDURAS BOAS ────────────────────────────────────────────────────────
  { externalId: 'T061', source: 'TACO', name: 'Azeite de oliva extravirgem', category: 'Óleos e gorduras', kcal: 884, protein: 0, carb: 0, fat: 100.0, servingLabel: '1 colher sopa (15ml)', servingGrams: 15 },
  { externalId: 'T062', source: 'TACO', name: 'Amendoim, torrado, sem sal', category: 'Nozes e sementes', kcal: 592, protein: 26.4, carb: 20.2, fat: 49.0, fiber: 6.0, servingLabel: '1 colher sopa cheia (20g)', servingGrams: 20 },
  { externalId: 'T063', source: 'TACO', name: 'Amêndoas, cruas', category: 'Nozes e sementes', kcal: 581, protein: 21.2, carb: 18.7, fat: 50.6, fiber: 11.5, servingLabel: '1 punhado (20g)', servingGrams: 20 },
  { externalId: 'T064', source: 'TACO', name: 'Castanha-do-pará, crua', category: 'Nozes e sementes', kcal: 656, protein: 14.3, carb: 12.3, fat: 63.5, fiber: 7.5, servingLabel: '1 unidade (5g)', servingGrams: 5 },
  { externalId: 'T065', source: 'TACO', name: 'Chia, semente', category: 'Nozes e sementes', kcal: 490, protein: 16.5, carb: 44.0, fat: 30.7, fiber: 34.4, calcium: 631, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T066', source: 'TACO', name: 'Linhaça dourada, semente', category: 'Nozes e sementes', kcal: 495, protein: 18.1, carb: 28.9, fat: 34.5, fiber: 27.3, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T067', source: 'TACO', name: 'Psyllium, casca em pó', category: 'Suplementos', kcal: 320, protein: 2.0, carb: 80.0, fat: 1.0, fiber: 78.0, servingLabel: '1 colher sopa (10g)', servingGrams: 10 },

  // ─── PROTEÍNAS VEGETAIS / LATICÍNIOS EXTRAS ───────────────────────────────
  { externalId: 'T068', source: 'TACO', name: 'Tofu, firme', category: 'Leguminosas', kcal: 76, protein: 8.1, carb: 1.9, fat: 4.8, calcium: 290, iron: 2.7 },
  { externalId: 'T069', source: 'TACO', name: 'Queijo minas frescal', category: 'Leite e derivados', kcal: 264, protein: 17.4, carb: 3.2, fat: 20.2, calcium: 568, sodium: 430, servingLabel: '1 fatia (30g)', servingGrams: 30 },
  { externalId: 'T070', source: 'TACO', name: 'Requeijão light', category: 'Leite e derivados', kcal: 159, protein: 7.8, carb: 4.4, fat: 12.4, calcium: 220, sodium: 620, servingLabel: '1 colher sopa (30g)', servingGrams: 30 },

  // ─── BEBIDAS E DIVERSOS ──────────────────────────────────────────────────
  { externalId: 'T071', source: 'TACO', name: 'Café preparado, infusão 10%, sem açúcar', category: 'Bebidas', kcal: 9, protein: 0.7, carb: 0.9, fat: 0, servingLabel: '1 xícara (50ml)', servingGrams: 50 },
  { externalId: 'T072', source: 'TACO', name: 'Chá mate, infusão sem açúcar', category: 'Bebidas', kcal: 3, protein: 0.1, carb: 0.6, fat: 0, servingLabel: '1 xícara (200ml)', servingGrams: 200 },
  { externalId: 'T073', source: 'TACO', name: 'Leite integral', category: 'Leite e derivados', kcal: 60, protein: 2.9, carb: 4.3, fat: 3.2, calcium: 113, servingLabel: '1 copo (200ml)', servingGrams: 200 },
  { externalId: 'T074', source: 'TACO', name: 'Pão francês', category: 'Panificados', kcal: 300, protein: 8.0, carb: 58.6, fat: 3.1, fiber: 2.3, sodium: 643, servingLabel: '1 unidade (50g)', servingGrams: 50 },
  { externalId: 'T075', source: 'TACO', name: 'Manteiga com sal', category: 'Óleos e gorduras', kcal: 726, protein: 0.5, carb: 0.1, fat: 82.0, sodium: 579, servingLabel: '1 colher chá (5g)', servingGrams: 5 },
  { externalId: 'T076', source: 'TACO', name: 'Margarina vegetal, 80% lipídios', category: 'Óleos e gorduras', kcal: 720, protein: 0.2, carb: 0.4, fat: 81.0, servingLabel: '1 colher chá (5g)', servingGrams: 5 },
  { externalId: 'T077', source: 'TACO', name: 'Iogurte natural integral', category: 'Leite e derivados', kcal: 51, protein: 4.1, carb: 4.0, fat: 1.5, calcium: 143, servingLabel: '1 pote (170g)', servingGrams: 170 },
  { externalId: 'T078', source: 'TACO', name: 'Mel de abelha', category: 'Açúcares e doces', kcal: 309, protein: 0.4, carb: 84.0, fat: 0, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T079', source: 'TACO', name: 'Açúcar refinado', category: 'Açúcares e doces', kcal: 387, protein: 0, carb: 99.5, fat: 0, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T080', source: 'TACO', name: 'Cuscuz de milho cozido', category: 'Cereais e derivados', kcal: 113, protein: 2.4, carb: 25.2, fat: 0.5, fiber: 1.5, servingLabel: '1 fatia (100g)', servingGrams: 100 },
  { externalId: 'T081', source: 'TACO', name: 'Tapioca pronta com recheio (referência)', category: 'Cereais e derivados', kcal: 350, protein: 0.2, carb: 88.0, fat: 0.2, servingLabel: '1 unidade (60g)', servingGrams: 60 },
  { externalId: 'T082', source: 'TACO', name: 'Banana prata, crua', category: 'Frutas', kcal: 98, protein: 1.3, carb: 26.0, fat: 0.1, fiber: 2.0, potassium: 358, servingLabel: '1 unidade (80g)', servingGrams: 80 },
];
