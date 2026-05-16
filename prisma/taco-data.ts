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

  // ─── MAIS CARNES E AVES ────────────────────────────────────────────────────
  { externalId: 'T083', source: 'TACO', name: 'Frango, sobrecoxa, sem pele, assada', category: 'Carne e derivados', kcal: 215, protein: 28.5, carb: 0, fat: 11.0 },
  { externalId: 'T084', source: 'TACO', name: 'Frango, coxa, sem pele, cozida', category: 'Carne e derivados', kcal: 190, protein: 29.0, carb: 0, fat: 8.0 },
  { externalId: 'T085', source: 'TACO', name: 'Frango, asa, com pele, frita', category: 'Carne e derivados', kcal: 298, protein: 25.7, carb: 0, fat: 21.5 },
  { externalId: 'T086', source: 'TACO', name: 'Frango, peito, desfiado, cozido', category: 'Carne e derivados', kcal: 165, protein: 31.0, carb: 0, fat: 3.6 },
  { externalId: 'T087', source: 'TACO', name: 'Frango, peito, à milanesa, frito', category: 'Carne e derivados', kcal: 247, protein: 22.0, carb: 12.5, fat: 12.6 },
  { externalId: 'T088', source: 'TACO', name: 'Boi, contra-filé, grelhado', category: 'Carne e derivados', kcal: 229, protein: 33.0, carb: 0, fat: 10.0 },
  { externalId: 'T089', source: 'TACO', name: 'Boi, fraldinha, grelhada', category: 'Carne e derivados', kcal: 270, protein: 30.0, carb: 0, fat: 16.0 },
  { externalId: 'T090', source: 'TACO', name: 'Boi, picanha, grelhada', category: 'Carne e derivados', kcal: 290, protein: 27.0, carb: 0, fat: 19.5 },
  { externalId: 'T091', source: 'TACO', name: 'Boi, maminha, grelhada', category: 'Carne e derivados', kcal: 230, protein: 32.0, carb: 0, fat: 11.0 },
  { externalId: 'T092', source: 'TACO', name: 'Boi, costela, assada', category: 'Carne e derivados', kcal: 373, protein: 25.0, carb: 0, fat: 30.0 },
  { externalId: 'T093', source: 'TACO', name: 'Boi, acém, cozido', category: 'Carne e derivados', kcal: 211, protein: 33.0, carb: 0, fat: 8.5 },
  { externalId: 'T094', source: 'TACO', name: 'Carne moída, magra, refogada', category: 'Carne e derivados', kcal: 212, protein: 27.0, carb: 0, fat: 11.0 },
  { externalId: 'T095', source: 'TACO', name: 'Suíno, pernil, assado', category: 'Carne e derivados', kcal: 297, protein: 30.0, carb: 0, fat: 19.0 },
  { externalId: 'T096', source: 'TACO', name: 'Suíno, costela, assada', category: 'Carne e derivados', kcal: 397, protein: 22.5, carb: 0, fat: 33.0 },
  { externalId: 'T097', source: 'TACO', name: 'Linguiça toscana, cozida', category: 'Carne e derivados', kcal: 280, protein: 17.0, carb: 1.0, fat: 23.0 },
  { externalId: 'T098', source: 'TACO', name: 'Linguiça calabresa, defumada', category: 'Carne e derivados', kcal: 280, protein: 23.5, carb: 0, fat: 21.0 },
  { externalId: 'T099', source: 'TACO', name: 'Bacon, defumado, frito', category: 'Carne e derivados', kcal: 541, protein: 37.0, carb: 1.4, fat: 42.0 },
  { externalId: 'T100', source: 'TACO', name: 'Presunto cozido magro', category: 'Carne e derivados', kcal: 116, protein: 16.0, carb: 1.5, fat: 5.0, sodium: 1100, servingLabel: '2 fatias (40g)', servingGrams: 40 },
  { externalId: 'T101', source: 'TACO', name: 'Peito de peru defumado', category: 'Carne e derivados', kcal: 105, protein: 18.5, carb: 0.5, fat: 3.0, sodium: 950, servingLabel: '2 fatias (30g)', servingGrams: 30 },
  { externalId: 'T102', source: 'TACO', name: 'Cordeiro, paleta, assada', category: 'Carne e derivados', kcal: 290, protein: 28.0, carb: 0, fat: 19.0 },
  { externalId: 'T103', source: 'TACO', name: 'Hambúrguer bovino, grelhado', category: 'Carne e derivados', kcal: 290, protein: 17.0, carb: 5.0, fat: 22.0 },
  { externalId: 'T104', source: 'TACO', name: 'Salsicha tipo viena', category: 'Carne e derivados', kcal: 257, protein: 11.0, carb: 3.0, fat: 22.5, sodium: 850 },

  // ─── MAIS PEIXES E FRUTOS DO MAR ───────────────────────────────────────────
  { externalId: 'T105', source: 'TACO', name: 'Bacalhau, cozido', category: 'Peixes e frutos do mar', kcal: 105, protein: 22.5, carb: 0, fat: 1.0 },
  { externalId: 'T106', source: 'TACO', name: 'Pescada, filé, grelhada', category: 'Peixes e frutos do mar', kcal: 117, protein: 23.5, carb: 0, fat: 2.4 },
  { externalId: 'T107', source: 'TACO', name: 'Merluza, filé, grelhada', category: 'Peixes e frutos do mar', kcal: 112, protein: 23.0, carb: 0, fat: 2.0 },
  { externalId: 'T108', source: 'TACO', name: 'Anchova, fresca, grelhada', category: 'Peixes e frutos do mar', kcal: 165, protein: 25.0, carb: 0, fat: 7.0 },
  { externalId: 'T109', source: 'TACO', name: 'Cavalinha, grelhada', category: 'Peixes e frutos do mar', kcal: 250, protein: 25.0, carb: 0, fat: 16.5 },
  { externalId: 'T110', source: 'TACO', name: 'Camarão, cozido', category: 'Peixes e frutos do mar', kcal: 90, protein: 19.0, carb: 0, fat: 1.0, sodium: 230 },
  { externalId: 'T111', source: 'TACO', name: 'Polvo, cozido', category: 'Peixes e frutos do mar', kcal: 82, protein: 16.5, carb: 1.5, fat: 1.0 },
  { externalId: 'T112', source: 'TACO', name: 'Lula, cozida', category: 'Peixes e frutos do mar', kcal: 95, protein: 17.0, carb: 3.5, fat: 1.6 },
  { externalId: 'T113', source: 'TACO', name: 'Atum, fresco, grelhado', category: 'Peixes e frutos do mar', kcal: 170, protein: 28.0, carb: 0, fat: 6.0 },

  // ─── MAIS OVOS E DERIVADOS ─────────────────────────────────────────────────
  { externalId: 'T114', source: 'TACO', name: 'Ovo de galinha, frito em óleo', category: 'Ovos e derivados', kcal: 196, protein: 13.6, carb: 0.6, fat: 15.5, servingLabel: '1 unidade (50g)', servingGrams: 50 },
  { externalId: 'T115', source: 'TACO', name: 'Ovo de galinha, mexido', category: 'Ovos e derivados', kcal: 168, protein: 12.0, carb: 1.5, fat: 12.5 },
  { externalId: 'T116', source: 'TACO', name: 'Ovo de codorna, cru', category: 'Ovos e derivados', kcal: 177, protein: 13.0, carb: 0.5, fat: 13.0, servingLabel: '1 unidade (10g)', servingGrams: 10 },
  { externalId: 'T117', source: 'TACO', name: 'Omelete simples (2 ovos)', category: 'Ovos e derivados', kcal: 170, protein: 12.5, carb: 1.0, fat: 13.0, servingLabel: '1 porção (100g)', servingGrams: 100 },

  // ─── MAIS LATICÍNIOS ───────────────────────────────────────────────────────
  { externalId: 'T118', source: 'TACO', name: 'Leite semidesnatado', category: 'Leite e derivados', kcal: 45, protein: 3.0, carb: 4.8, fat: 1.5, calcium: 124, servingLabel: '1 copo (200ml)', servingGrams: 200 },
  { externalId: 'T119', source: 'TACO', name: 'Iogurte grego natural', category: 'Leite e derivados', kcal: 97, protein: 9.0, carb: 4.0, fat: 5.0, calcium: 110, servingLabel: '1 pote (170g)', servingGrams: 170 },
  { externalId: 'T120', source: 'TACO', name: 'Iogurte de frutas, com açúcar', category: 'Leite e derivados', kcal: 84, protein: 3.0, carb: 13.0, fat: 1.5, servingLabel: '1 pote (170g)', servingGrams: 170 },
  { externalId: 'T121', source: 'TACO', name: 'Queijo mussarela', category: 'Leite e derivados', kcal: 280, protein: 22.0, carb: 3.0, fat: 20.0, calcium: 690, sodium: 530, servingLabel: '1 fatia (20g)', servingGrams: 20 },
  { externalId: 'T122', source: 'TACO', name: 'Queijo prato', category: 'Leite e derivados', kcal: 360, protein: 24.0, carb: 1.5, fat: 29.0, calcium: 870, sodium: 550, servingLabel: '1 fatia (20g)', servingGrams: 20 },
  { externalId: 'T123', source: 'TACO', name: 'Queijo parmesão ralado', category: 'Leite e derivados', kcal: 453, protein: 35.5, carb: 1.5, fat: 33.0, calcium: 1184, sodium: 1500, servingLabel: '1 colher sopa (10g)', servingGrams: 10 },
  { externalId: 'T124', source: 'TACO', name: 'Queijo coalho, grelhado', category: 'Leite e derivados', kcal: 296, protein: 23.0, carb: 1.5, fat: 22.0, calcium: 690 },
  { externalId: 'T125', source: 'TACO', name: 'Ricota fresca', category: 'Leite e derivados', kcal: 140, protein: 11.0, carb: 4.0, fat: 9.0, calcium: 207, servingLabel: '1 fatia (30g)', servingGrams: 30 },
  { externalId: 'T126', source: 'TACO', name: 'Creme de leite, lata', category: 'Leite e derivados', kcal: 217, protein: 2.5, carb: 4.0, fat: 21.5 },
  { externalId: 'T127', source: 'TACO', name: 'Leite condensado', category: 'Leite e derivados', kcal: 321, protein: 7.5, carb: 55.0, fat: 8.0, calcium: 285 },
  { externalId: 'T128', source: 'TACO', name: 'Cream cheese', category: 'Leite e derivados', kcal: 290, protein: 5.5, carb: 4.0, fat: 28.0 },

  // ─── MAIS CARBOIDRATOS / CEREAIS ───────────────────────────────────────────
  { externalId: 'T129', source: 'TACO', name: 'Arroz parboilizado, cozido', category: 'Cereais e derivados', kcal: 130, protein: 2.6, carb: 28.0, fat: 0.3, fiber: 1.0 },
  { externalId: 'T130', source: 'TACO', name: 'Arroz, branco, cozido com sal', category: 'Cereais e derivados', kcal: 130, protein: 2.5, carb: 28.5, fat: 0.2, sodium: 480 },
  { externalId: 'T131', source: 'TACO', name: 'Quinoa cozida', category: 'Cereais e derivados', kcal: 120, protein: 4.4, carb: 21.3, fat: 1.9, fiber: 2.8 },
  { externalId: 'T132', source: 'TACO', name: 'Macarrão integral, cozido', category: 'Cereais e derivados', kcal: 124, protein: 5.3, carb: 26.0, fat: 0.5, fiber: 3.2 },
  { externalId: 'T133', source: 'TACO', name: 'Lasanha de carne, pronta', category: 'Pratos preparados', kcal: 175, protein: 9.5, carb: 14.0, fat: 9.0 },
  { externalId: 'T134', source: 'TACO', name: 'Pizza tradicional (média)', category: 'Pratos preparados', kcal: 270, protein: 11.0, carb: 33.0, fat: 10.5, servingLabel: '1 fatia (100g)', servingGrams: 100 },
  { externalId: 'T135', source: 'TACO', name: 'Fubá, farinha de milho', category: 'Cereais e derivados', kcal: 366, protein: 9.0, carb: 76.0, fat: 4.0, fiber: 7.0 },
  { externalId: 'T136', source: 'TACO', name: 'Polenta cozida', category: 'Cereais e derivados', kcal: 71, protein: 1.8, carb: 14.0, fat: 0.8 },
  { externalId: 'T137', source: 'TACO', name: 'Milho verde, cozido', category: 'Cereais e derivados', kcal: 98, protein: 3.3, carb: 21.0, fat: 1.5, fiber: 4.0 },
  { externalId: 'T138', source: 'TACO', name: 'Pipoca, sem óleo', category: 'Cereais e derivados', kcal: 387, protein: 13.0, carb: 78.0, fat: 4.5, fiber: 15.0 },
  { externalId: 'T139', source: 'TACO', name: 'Granola tradicional', category: 'Cereais e derivados', kcal: 471, protein: 9.0, carb: 64.0, fat: 19.0, fiber: 7.0, servingLabel: '2 colheres sopa (30g)', servingGrams: 30 },
  { externalId: 'T140', source: 'TACO', name: 'Aveia em farelo', category: 'Cereais e derivados', kcal: 393, protein: 15.6, carb: 66.0, fat: 9.1, fiber: 9.0 },
  { externalId: 'T141', source: 'TACO', name: 'Corn flakes, sem açúcar', category: 'Cereais e derivados', kcal: 376, protein: 7.0, carb: 84.0, fat: 0.7, fiber: 3.5, sodium: 600 },
  { externalId: 'T142', source: 'TACO', name: 'Cuscuz marroquino, cozido', category: 'Cereais e derivados', kcal: 113, protein: 3.8, carb: 23.0, fat: 0.2 },

  // ─── MAIS PANIFICADOS ──────────────────────────────────────────────────────
  { externalId: 'T143', source: 'TACO', name: 'Pão de forma branco', category: 'Panificados', kcal: 270, protein: 9.0, carb: 50.0, fat: 3.5, fiber: 2.3, servingLabel: '1 fatia (25g)', servingGrams: 25 },
  { externalId: 'T144', source: 'TACO', name: 'Pão de forma integral', category: 'Panificados', kcal: 254, protein: 9.5, carb: 47.0, fat: 3.5, fiber: 6.9, servingLabel: '1 fatia (25g)', servingGrams: 25 },
  { externalId: 'T145', source: 'TACO', name: 'Pão de queijo', category: 'Panificados', kcal: 280, protein: 5.0, carb: 39.0, fat: 11.5, servingLabel: '1 unidade média (20g)', servingGrams: 20 },
  { externalId: 'T146', source: 'TACO', name: 'Torrada simples', category: 'Panificados', kcal: 390, protein: 10.0, carb: 71.0, fat: 7.5, fiber: 3.5, servingLabel: '1 torrada (10g)', servingGrams: 10 },
  { externalId: 'T147', source: 'TACO', name: 'Biscoito cream cracker', category: 'Panificados', kcal: 432, protein: 9.0, carb: 70.0, fat: 13.0, sodium: 700, servingLabel: '5 unidades (30g)', servingGrams: 30 },
  { externalId: 'T148', source: 'TACO', name: 'Biscoito recheado de chocolate', category: 'Panificados', kcal: 472, protein: 5.5, carb: 70.0, fat: 19.0, servingLabel: '3 unidades (30g)', servingGrams: 30 },
  { externalId: 'T149', source: 'TACO', name: 'Bolo de chocolate', category: 'Panificados', kcal: 335, protein: 4.5, carb: 47.0, fat: 15.0, servingLabel: '1 fatia (60g)', servingGrams: 60 },

  // ─── MAIS TUBÉRCULOS E RAÍZES ──────────────────────────────────────────────
  { externalId: 'T150', source: 'TACO', name: 'Batata frita (palito), fritura por imersão', category: 'Tubérculos e raízes', kcal: 297, protein: 3.8, carb: 36.0, fat: 16.0 },
  { externalId: 'T151', source: 'TACO', name: 'Batata baroa, cozida', category: 'Tubérculos e raízes', kcal: 80, protein: 1.5, carb: 18.0, fat: 0.3, fiber: 2.0 },
  { externalId: 'T152', source: 'TACO', name: 'Cará, cozido', category: 'Tubérculos e raízes', kcal: 100, protein: 1.5, carb: 23.0, fat: 0.1, fiber: 2.7 },
  { externalId: 'T153', source: 'TACO', name: 'Farinha de mandioca crua', category: 'Tubérculos e raízes', kcal: 365, protein: 1.4, carb: 87.0, fat: 0.3, fiber: 6.4 },
  { externalId: 'T154', source: 'TACO', name: 'Farofa pronta com bacon', category: 'Tubérculos e raízes', kcal: 423, protein: 4.0, carb: 66.0, fat: 17.0 },

  // ─── MAIS LEGUMINOSAS ──────────────────────────────────────────────────────
  { externalId: 'T155', source: 'TACO', name: 'Feijão fradinho, cozido', category: 'Leguminosas', kcal: 85, protein: 5.0, carb: 16.0, fat: 0.4, fiber: 6.0 },
  { externalId: 'T156', source: 'TACO', name: 'Feijão branco, cozido', category: 'Leguminosas', kcal: 90, protein: 6.0, carb: 16.0, fat: 0.5, fiber: 8.0 },
  { externalId: 'T157', source: 'TACO', name: 'Feijoada completa', category: 'Pratos preparados', kcal: 117, protein: 8.0, carb: 6.5, fat: 6.5 },
  { externalId: 'T158', source: 'TACO', name: 'Soja em grão, cozida', category: 'Leguminosas', kcal: 173, protein: 16.5, carb: 9.0, fat: 9.0, fiber: 6.0 },
  { externalId: 'T159', source: 'TACO', name: 'Edamame, cozida', category: 'Leguminosas', kcal: 122, protein: 11.0, carb: 9.5, fat: 5.0, fiber: 5.2 },

  // ─── MAIS FRUTAS ───────────────────────────────────────────────────────────
  { externalId: 'T160', source: 'TACO', name: 'Manga, crua', category: 'Frutas', kcal: 64, protein: 0.5, carb: 17.0, fat: 0.2, fiber: 2.1, vitC: 27.0 },
  { externalId: 'T161', source: 'TACO', name: 'Uva passa', category: 'Frutas', kcal: 299, protein: 3.0, carb: 80.0, fat: 0.5, fiber: 4.0, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T162', source: 'TACO', name: 'Tangerina, crua', category: 'Frutas', kcal: 38, protein: 0.8, carb: 9.0, fat: 0.1, fiber: 0.9, vitC: 48 },
  { externalId: 'T163', source: 'TACO', name: 'Pêssego, cru', category: 'Frutas', kcal: 36, protein: 0.8, carb: 9.5, fat: 0.1, fiber: 1.4, vitC: 6.6 },
  { externalId: 'T164', source: 'TACO', name: 'Caqui, cru', category: 'Frutas', kcal: 71, protein: 0.4, carb: 19.0, fat: 0.1, fiber: 6.5 },
  { externalId: 'T165', source: 'TACO', name: 'Goiaba, crua', category: 'Frutas', kcal: 52, protein: 1.1, carb: 13.0, fat: 0.4, fiber: 6.0, vitC: 80.0 },
  { externalId: 'T166', source: 'TACO', name: 'Açaí, polpa, sem açúcar', category: 'Frutas', kcal: 58, protein: 0.8, carb: 6.2, fat: 3.9, fiber: 2.6 },
  { externalId: 'T167', source: 'TACO', name: 'Limão tahiti, cru', category: 'Frutas', kcal: 32, protein: 0.9, carb: 9.0, fat: 0.2, vitC: 38.2 },
  { externalId: 'T168', source: 'TACO', name: 'Coco, polpa, fresco', category: 'Frutas', kcal: 406, protein: 3.7, carb: 10.0, fat: 42.0, fiber: 5.4 },
  { externalId: 'T169', source: 'TACO', name: 'Água de coco', category: 'Bebidas', kcal: 22, protein: 0.6, carb: 5.3, fat: 0.1, potassium: 156, servingLabel: '1 copo (200ml)', servingGrams: 200 },
  { externalId: 'T170', source: 'TACO', name: 'Maracujá, polpa, fresca', category: 'Frutas', kcal: 68, protein: 2.0, carb: 12.0, fat: 2.1, fiber: 1.0, vitC: 19.8 },
  { externalId: 'T171', source: 'TACO', name: 'Ameixa, fresca', category: 'Frutas', kcal: 53, protein: 0.8, carb: 13.0, fat: 0.2, fiber: 2.4 },
  { externalId: 'T172', source: 'TACO', name: 'Figo, cru', category: 'Frutas', kcal: 41, protein: 0.9, carb: 10.0, fat: 0.2, fiber: 1.8 },
  { externalId: 'T173', source: 'TACO', name: 'Ameixa preta, seca', category: 'Frutas', kcal: 273, protein: 2.0, carb: 73.0, fat: 0.4, fiber: 7.5, servingLabel: '5 unidades (30g)', servingGrams: 30 },
  { externalId: 'T174', source: 'TACO', name: 'Damasco seco', category: 'Frutas', kcal: 240, protein: 3.0, carb: 63.0, fat: 0.5, fiber: 7.0 },
  { externalId: 'T175', source: 'TACO', name: 'Tâmara seca', category: 'Frutas', kcal: 277, protein: 1.8, carb: 75.0, fat: 0.2, fiber: 6.7 },

  // ─── MAIS VERDURAS E HORTALIÇAS ────────────────────────────────────────────
  { externalId: 'T176', source: 'TACO', name: 'Repolho cru', category: 'Verduras e hortaliças', kcal: 24, protein: 1.4, carb: 5.4, fat: 0.1, fiber: 2.5, vitC: 36.0 },
  { externalId: 'T177', source: 'TACO', name: 'Alface americana, crua', category: 'Verduras e hortaliças', kcal: 14, protein: 1.0, carb: 3.0, fat: 0.1, fiber: 1.4 },
  { externalId: 'T178', source: 'TACO', name: 'Acelga, crua', category: 'Verduras e hortaliças', kcal: 15, protein: 1.5, carb: 1.6, fat: 0.2, fiber: 1.6 },
  { externalId: 'T179', source: 'TACO', name: 'Berinjela, cozida', category: 'Verduras e hortaliças', kcal: 24, protein: 1.0, carb: 5.7, fat: 0.2, fiber: 3.0 },
  { externalId: 'T180', source: 'TACO', name: 'Abóbora japonesa (cabotiá), cozida', category: 'Verduras e hortaliças', kcal: 30, protein: 1.4, carb: 7.0, fat: 0.1, fiber: 2.3 },
  { externalId: 'T181', source: 'TACO', name: 'Abóbora moranga, cozida', category: 'Verduras e hortaliças', kcal: 25, protein: 1.0, carb: 6.0, fat: 0.1, fiber: 1.5 },
  { externalId: 'T182', source: 'TACO', name: 'Quiabo, cozido', category: 'Verduras e hortaliças', kcal: 31, protein: 1.9, carb: 7.0, fat: 0.2, fiber: 3.2 },
  { externalId: 'T183', source: 'TACO', name: 'Vagem, cozida', category: 'Verduras e hortaliças', kcal: 27, protein: 1.8, carb: 5.7, fat: 0.2, fiber: 2.7 },
  { externalId: 'T184', source: 'TACO', name: 'Pimentão verde, cru', category: 'Verduras e hortaliças', kcal: 21, protein: 1.0, carb: 4.7, fat: 0.2, fiber: 2.5, vitC: 100.0 },
  { externalId: 'T185', source: 'TACO', name: 'Chuchu, cozido', category: 'Verduras e hortaliças', kcal: 16, protein: 0.5, carb: 3.8, fat: 0.1, fiber: 1.3 },
  { externalId: 'T186', source: 'TACO', name: 'Cogumelo paris, cru', category: 'Verduras e hortaliças', kcal: 22, protein: 3.1, carb: 3.3, fat: 0.3, fiber: 1.0 },
  { externalId: 'T187', source: 'TACO', name: 'Cogumelo shiitake, fresco', category: 'Verduras e hortaliças', kcal: 34, protein: 2.2, carb: 6.8, fat: 0.5, fiber: 2.5 },
  { externalId: 'T188', source: 'TACO', name: 'Alho-poró, cru', category: 'Verduras e hortaliças', kcal: 36, protein: 1.5, carb: 8.0, fat: 0.3, fiber: 1.8 },
  { externalId: 'T189', source: 'TACO', name: 'Alho cru', category: 'Verduras e hortaliças', kcal: 149, protein: 6.4, carb: 33.0, fat: 0.5, fiber: 2.1 },
  { externalId: 'T190', source: 'TACO', name: 'Salsa fresca', category: 'Verduras e hortaliças', kcal: 36, protein: 3.0, carb: 6.3, fat: 0.8, fiber: 3.3 },
  { externalId: 'T191', source: 'TACO', name: 'Coentro fresco', category: 'Verduras e hortaliças', kcal: 27, protein: 2.5, carb: 4.0, fat: 0.5, fiber: 2.8 },

  // ─── MAIS GORDURAS / NOZES / SEMENTES ──────────────────────────────────────
  { externalId: 'T192', source: 'TACO', name: 'Castanha de caju, torrada', category: 'Nozes e sementes', kcal: 570, protein: 18.0, carb: 30.0, fat: 46.0, fiber: 3.0, servingLabel: '1 punhado (20g)', servingGrams: 20 },
  { externalId: 'T193', source: 'TACO', name: 'Nozes, cruas', category: 'Nozes e sementes', kcal: 651, protein: 14.0, carb: 13.7, fat: 65.0, fiber: 6.7, servingLabel: '5 unidades (20g)', servingGrams: 20 },
  { externalId: 'T194', source: 'TACO', name: 'Avelã, crua', category: 'Nozes e sementes', kcal: 628, protein: 15.0, carb: 16.7, fat: 61.0, fiber: 9.7 },
  { externalId: 'T195', source: 'TACO', name: 'Pistache, torrado', category: 'Nozes e sementes', kcal: 562, protein: 21.0, carb: 28.0, fat: 45.0, fiber: 10.0 },
  { externalId: 'T196', source: 'TACO', name: 'Macadâmia, crua', category: 'Nozes e sementes', kcal: 718, protein: 7.9, carb: 14.0, fat: 76.0, fiber: 8.6 },
  { externalId: 'T197', source: 'TACO', name: 'Semente de abóbora, torrada', category: 'Nozes e sementes', kcal: 559, protein: 30.0, carb: 11.0, fat: 49.0, fiber: 6.0 },
  { externalId: 'T198', source: 'TACO', name: 'Semente de girassol, torrada', category: 'Nozes e sementes', kcal: 619, protein: 24.0, carb: 13.0, fat: 53.0, fiber: 11.0 },
  { externalId: 'T199', source: 'TACO', name: 'Pasta de amendoim integral', category: 'Nozes e sementes', kcal: 590, protein: 25.0, carb: 20.0, fat: 50.0, fiber: 6.0, servingLabel: '1 colher sopa (16g)', servingGrams: 16 },
  { externalId: 'T200', source: 'TACO', name: 'Tahine (pasta de gergelim)', category: 'Nozes e sementes', kcal: 595, protein: 17.0, carb: 21.2, fat: 54.0, fiber: 9.3 },
  { externalId: 'T201', source: 'TACO', name: 'Óleo de coco', category: 'Óleos e gorduras', kcal: 862, protein: 0, carb: 0, fat: 99.0, servingLabel: '1 colher sopa (15g)', servingGrams: 15 },
  { externalId: 'T202', source: 'TACO', name: 'Óleo de soja', category: 'Óleos e gorduras', kcal: 884, protein: 0, carb: 0, fat: 100.0 },
  { externalId: 'T203', source: 'TACO', name: 'Banha de porco', category: 'Óleos e gorduras', kcal: 891, protein: 0, carb: 0, fat: 99.0 },

  // ─── BEBIDAS ───────────────────────────────────────────────────────────────
  { externalId: 'T204', source: 'TACO', name: 'Suco de laranja, natural', category: 'Bebidas', kcal: 41, protein: 0.7, carb: 9.6, fat: 0.1, vitC: 70.0 },
  { externalId: 'T205', source: 'TACO', name: 'Suco de uva, integral', category: 'Bebidas', kcal: 61, protein: 0.4, carb: 15.0, fat: 0.1 },
  { externalId: 'T206', source: 'TACO', name: 'Refrigerante de cola', category: 'Bebidas', kcal: 39, protein: 0, carb: 10.0, fat: 0 },
  { externalId: 'T207', source: 'TACO', name: 'Refrigerante zero açúcar', category: 'Bebidas', kcal: 0, protein: 0, carb: 0, fat: 0 },
  { externalId: 'T208', source: 'TACO', name: 'Cerveja pilsen', category: 'Bebidas alcoólicas', kcal: 43, protein: 0.5, carb: 3.5, fat: 0 },
  { externalId: 'T209', source: 'TACO', name: 'Vinho tinto seco', category: 'Bebidas alcoólicas', kcal: 85, protein: 0.1, carb: 2.5, fat: 0 },
  { externalId: 'T210', source: 'TACO', name: 'Cachaça (40% álcool)', category: 'Bebidas alcoólicas', kcal: 231, protein: 0, carb: 0, fat: 0 },
  { externalId: 'T211', source: 'TACO', name: 'Whey protein concentrado, baunilha', category: 'Suplementos', kcal: 400, protein: 75.0, carb: 10.0, fat: 5.0, servingLabel: '1 scoop (30g)', servingGrams: 30 },
  { externalId: 'T212', source: 'TACO', name: 'Whey protein isolado', category: 'Suplementos', kcal: 380, protein: 90.0, carb: 2.0, fat: 1.5, servingLabel: '1 scoop (30g)', servingGrams: 30 },
  { externalId: 'T213', source: 'TACO', name: 'Hipercalórico (mass gainer)', category: 'Suplementos', kcal: 380, protein: 22.0, carb: 70.0, fat: 4.0 },
  { externalId: 'T214', source: 'TACO', name: 'Albumina em pó', category: 'Suplementos', kcal: 380, protein: 85.0, carb: 4.0, fat: 0 },

  // ─── DOCES E SOBREMESAS ───────────────────────────────────────────────────
  { externalId: 'T215', source: 'TACO', name: 'Chocolate ao leite', category: 'Açúcares e doces', kcal: 540, protein: 7.5, carb: 60.0, fat: 30.0, servingLabel: '1 barra pequena (25g)', servingGrams: 25 },
  { externalId: 'T216', source: 'TACO', name: 'Chocolate amargo 70% cacau', category: 'Açúcares e doces', kcal: 600, protein: 9.0, carb: 30.0, fat: 47.0, fiber: 11.0, servingLabel: '1 quadrado (10g)', servingGrams: 10 },
  { externalId: 'T217', source: 'TACO', name: 'Sorvete de creme', category: 'Açúcares e doces', kcal: 207, protein: 3.5, carb: 23.0, fat: 11.0, servingLabel: '1 bola (60g)', servingGrams: 60 },
  { externalId: 'T218', source: 'TACO', name: 'Doce de leite cremoso', category: 'Açúcares e doces', kcal: 315, protein: 6.5, carb: 55.0, fat: 7.5 },
  { externalId: 'T219', source: 'TACO', name: 'Brigadeiro (pronto)', category: 'Açúcares e doces', kcal: 410, protein: 5.0, carb: 65.0, fat: 14.0, servingLabel: '1 unidade (20g)', servingGrams: 20 },
  { externalId: 'T220', source: 'TACO', name: 'Pudim de leite', category: 'Açúcares e doces', kcal: 197, protein: 4.0, carb: 30.0, fat: 6.5, servingLabel: '1 fatia (100g)', servingGrams: 100 },

  // ─── PRATOS PREPARADOS / FAST FOOD ─────────────────────────────────────────
  { externalId: 'T221', source: 'TACO', name: 'Hambúrguer com queijo (X-Burger)', category: 'Pratos preparados', kcal: 286, protein: 14.5, carb: 25.0, fat: 14.0, servingLabel: '1 unidade (150g)', servingGrams: 150 },
  { externalId: 'T222', source: 'TACO', name: 'Sanduíche natural de frango', category: 'Pratos preparados', kcal: 200, protein: 12.0, carb: 22.0, fat: 7.0 },
  { externalId: 'T223', source: 'TACO', name: 'Salada caesar com frango', category: 'Pratos preparados', kcal: 145, protein: 14.0, carb: 6.0, fat: 7.5 },
  { externalId: 'T224', source: 'TACO', name: 'Coxinha frita', category: 'Pratos preparados', kcal: 263, protein: 9.0, carb: 30.0, fat: 12.5, servingLabel: '1 unidade (40g)', servingGrams: 40 },
  { externalId: 'T225', source: 'TACO', name: 'Esfiha de carne', category: 'Pratos preparados', kcal: 235, protein: 9.0, carb: 30.0, fat: 9.0 },
  { externalId: 'T226', source: 'TACO', name: 'Salgadinho industrializado (tipo chips)', category: 'Pratos preparados', kcal: 525, protein: 6.0, carb: 60.0, fat: 30.0, sodium: 600 },
];
