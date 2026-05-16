import { prisma } from './db';
import type { Food } from '@prisma/client';

/**
 * Normaliza string para matching: minúsculas, sem acentos, sem pontuação.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[,;()\[\]]/g, ' ')                        // remove pontuação
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Score de similaridade entre query e nome de alimento.
 * Quanto mais palavras da query aparecem no nome, maior o score.
 * Penaliza nomes muito longos (mais palavras = menos específico).
 */
function score(queryNorm: string, nameNorm: string): number {
  const qWords = queryNorm.split(' ').filter(w => w.length > 2);
  if (qWords.length === 0) return 0;

  let matched = 0;
  for (const w of qWords) {
    if (nameNorm.includes(w)) matched++;
  }
  if (matched === 0) return 0;

  // % de palavras da query que apareceram, com bônus se for a maioria
  const ratio = matched / qWords.length;
  const lengthPenalty = 1 / Math.max(1, nameNorm.split(' ').length / 3);

  return ratio * lengthPenalty;
}

/**
 * Busca o melhor match de alimento pelo nome livre.
 * Retorna null se nenhum nome bater pelo menos 50% das palavras.
 */
export async function findFoodByName(name: string): Promise<Food | null> {
  const qNorm = normalize(name);

  // Pega todos os alimentos (são apenas ~70 — barato)
  const foods = await prisma.food.findMany();
  if (foods.length === 0) return null;

  let best: { food: Food; score: number } | null = null;
  for (const f of foods) {
    const s = score(qNorm, normalize(f.name));
    if (s > 0 && (!best || s > best.score)) best = { food: f, score: s };
  }

  if (!best || best.score < 0.5) return null;
  return best.food;
}

/**
 * Busca múltiplos alimentos em lote.
 * Retorna lista paralela com null para os não encontrados.
 */
export async function findFoodsByNames(names: string[]): Promise<(Food | null)[]> {
  const foods = await prisma.food.findMany();
  return names.map(name => {
    const qNorm = normalize(name);
    let best: { food: Food; score: number } | null = null;
    for (const f of foods) {
      const s = score(qNorm, normalize(f.name));
      if (s > 0 && (!best || s > best.score)) best = { food: f, score: s };
    }
    return best && best.score >= 0.5 ? best.food : null;
  });
}
