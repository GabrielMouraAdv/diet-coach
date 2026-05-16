import { prisma } from './db';
import type { Food } from '@prisma/client';

// Stopwords em PT-BR — ignoradas no matching
const STOPWORDS = new Set([
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'com', 'sem', 'para', 'por', 'pra', 'pro', 'a', 'o', 'as', 'os',
  'um', 'uma', 'uns', 'umas', 'e', 'ou',
]);

/** Normaliza: minúsculas, sem acentos, sem pontuação. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[,;()\[\]\-\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Quebra em palavras significativas (sem stopwords, mínimo 3 chars). */
function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter(w => w.length >= 3 && !STOPWORDS.has(w));
}

/**
 * Score bidirecional entre query e nome do alimento.
 *
 * Para queries multi-palavra: usa MÍNIMO entre (query→food) e (food→query),
 * exigindo pelo menos 50% de match em AMBAS direções. Isso bloqueia matches
 * onde só uma palavra coincidentemente bate (ex: "café preto" vs "feijão preto").
 *
 * Para queries de 1 palavra: aceita match simples (contains) + penaliza
 * nomes muito longos para preferir o alimento mais comum.
 */
function score(query: string, foodName: string): number {
  const qWords = tokenize(query);
  const fWords = tokenize(foodName);
  if (qWords.length === 0 || fWords.length === 0) return 0;

  if (qWords.length === 1) {
    // 1 palavra: precisa estar dentro do nome
    if (!fWords.some(w => w === qWords[0] || w.startsWith(qWords[0]))) return 0;
    // Bônus se a palavra for a PRIMEIRA do nome
    const headBonus = fWords[0].startsWith(qWords[0]) ? 0.3 : 0;
    return 0.5 + headBonus + 0.2 / fWords.length;
  }

  // Multi-palavra: matching bidirecional
  const qInF = qWords.filter(qw => fWords.some(fw => fw === qw || fw.startsWith(qw))).length;
  const fInQ = fWords.filter(fw => qWords.some(qw => qw === fw || fw.startsWith(qw))).length;

  const qRatio = qInF / qWords.length;       // % das palavras da query que aparecem no alimento
  const fRatio = fInQ / fWords.length;       // % das palavras do alimento que aparecem na query
  const minRatio = Math.min(qRatio, fRatio);

  // Threshold mínimo: 50% em ambas direções
  if (minRatio < 0.5) return 0;

  // Score = média ponderada (favorece quando ambas as direções batem)
  return (qRatio + fRatio) / 2;
}

/** Match único. Retorna null se nada passar do threshold. */
export async function findFoodByName(name: string): Promise<Food | null> {
  const foods = await prisma.food.findMany();
  if (foods.length === 0) return null;

  let best: { food: Food; score: number } | null = null;
  for (const f of foods) {
    const s = score(name, f.name);
    if (s > 0 && (!best || s > best.score)) best = { food: f, score: s };
  }

  return best?.food ?? null;
}

/** Match em lote — útil pra processar cardápio inteiro. */
export async function findFoodsByNames(names: string[]): Promise<(Food | null)[]> {
  const foods = await prisma.food.findMany();
  return names.map(name => {
    let best: { food: Food; score: number } | null = null;
    for (const f of foods) {
      const s = score(name, f.name);
      if (s > 0 && (!best || s > best.score)) best = { food: f, score: s };
    }
    return best?.food ?? null;
  });
}
