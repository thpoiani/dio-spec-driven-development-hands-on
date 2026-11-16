# INSTRUCTIONS.md — brief da wiki

Esta wiki é a **base de conhecimento dos jogos** do Game Copilot (hands-on da aula 2 do curso DIO de Spec-Driven Development). Ela contém **apenas conhecimento de jogo** — nada de documentação de projeto (arquitetura, processos e decisões vivem nos docs da raiz: `SCOPE.md`, `ARCHITECTURE.md`, `AGENTS.md`).

## Organização: um jogo por pasta

Cada jogo tem uma pasta com o slug do título (`openwiki/<game-slug>/`), contendo:

- `schema.md` — os tipos de página e campos obrigatórios do jogo (a spec daquele conhecimento);
- `world-map.md` (ou equivalente) — o esqueleto curado do mundo e o gating;
- páginas de entidades do jogo (níveis/áreas/objetos/personagens), geradas e curadas a partir de fontes registradas.

**Jogo novo no futuro = pasta nova** com o schema e as fontes daquele jogo. Os consumidores (motor de regras, agente) leem a wiki sem saber de qual jogo ela vem.

## Estado atual

- `super-mario-world/` — em construção (ingestão do detonado PC do Paulo + validação canônica via Super Mario Wiki).

## Regras de conteúdo (obrigatórias)

1. **Somente conhecimento de jogo**: mundo, progressão, gating, itens, personagens, estratégias. Nunca arquitetura do projeto, componentes, processos ou issues.
2. **Provenance em toda página**: `sources` apontando o detonado/fonte; afirmações materializadas como Claims com evidência.
3. **Prosa em português (pt-BR)**; identificadores canônicos em inglês kebab-case.
4. **Fail fast**: página fora do schema do jogo é erro de validação, não conteúdo aceito.

## Vocabulário (por jogo)

- **super-mario-world**: perfis `casual`, `completionist`, `speedrunner`; eventos `area_entered`, `level_started`, `level_completed`, `inventory_opened`, `boss_engaged`. **Avoid**: "quest", "batalha", "grafo tipado".
