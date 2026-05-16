# 🥗 Diet Coach

Coach de bem-estar, dieta e saúde na palma da mão.

## Stack
- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Prisma** + **SQLite** (local, sem servidor)
- Charts via Recharts

## Fontes científicas incorporadas
| Fonte | O que fornece |
|---|---|
| Haluch, *Metabolismo e Emagrecimento* (2020) | BMR/TDEE, TID por macro, fibra alvo, presets de dieta, alertas de platô |
| Haluch, *Estratégias Nutricionais* (2019) | Tabela TACO, substituições, cheat meal, cardápios modelo, timing peri-treino |
| Haluch, *Testosterona: Fisiologia, Estética e Saúde* (2020) | Presets TRT/AAS/SERM/AI/hCG, valores de referência de exames, alertas hormonais |
| Santos KS et al., RBONE v.19 n.120 (2025) | Protocolo escalonamento tirzepatida, eficácia por dose, labs periódicos |
| Amaro CC, UNISUL (2025) | Mecanismo GLP-1+GIP, efeitos colaterais, integração com nutrição |

## Setup (3 comandos)

```bash
cd diet-coach
npm install --legacy-peer-deps
npm run db:push
npm run db:seed
npm run dev
```

Acesse `http://localhost:3000` → app abre no perfil para você preencher seus dados.

## Atualizar banco após mudança no schema

```bash
npm run db:push
```

## Funcionalidades — Fase 1 (atual)

| Módulo | O que faz |
|---|---|
| **Perfil** | BMR (Mifflin-St Jeor ou Katch-McArdle com %BF), TDEE, metas calóricas e macros calculadas ao vivo |
| **Diário** | Registro de refeições por slot (café, lanche, almoço…), busca na base TACO (70 alimentos), macros em tempo real, substituição de alimentos por equivalência |
| **Dashboard** | Anel de progresso calórico, barras macro, toggle de dia lixo (+600 kcal com recálculo), dica do dia (38 pílulas de Haluch + artigos) |
| **Medicamentos** | Presets de 20+ medicamentos (Mounjaro, TRT, SERM, AI, hCG, T4…), escalonamento Mounjaro 2,5→15 mg, log de doses com dropdown de efeitos colaterais, alertas automáticos |
| **Evolução** | Registro de peso, %BF e circunferências, gráfico histórico |
| **Exames** | Inserção de resultados laboratoriais com alertas automáticos (Ht>54, PSA>4, T<300, E2, LDL/HDL, TGO/TGP) — valores de referência baseados em Haluch (2020) e Endocrine Society (2018) |

## Fase 2 (próximas features)

- [ ] Módulo de treino (exercícios, séries, carga)
- [ ] Micronutrientes (ferro, cálcio, sódio, vitamina C)
- [ ] Gráfico de evolução de medidas + fotos de progresso
- [ ] Lembretes de medicamento e exame (via push PWA)
- [ ] Cardápios modelo (1200 kcal, 1500, 1800) gerados automaticamente
- [ ] Exportar relatório semanal em PDF
- [ ] Deploy na nuvem (Vercel + PostgreSQL)

## Aviso legal

> Este app é uma ferramenta de rastreamento pessoal. **Não substitui orientação médica, nutricional ou farmacêutica.** Medicamentos (tirzepatida, TRT, AAS, hormônios) requerem prescrição e acompanhamento profissional. Os valores de referência de exames são baseados em literatura científica e podem diferir dos adotados pelo seu médico.
