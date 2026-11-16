---
title: "Base de conhecimento: schema OKF da wiki do mundo"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:26:03.041Z
sources:
  - id: openwiki-source-362e06c30ccfdafd87339cb0
    resource: repo://ARCHITECTURE.md
generated: { by: "opencode", at: "2026-11-16T17:26:03.041Z" }
---

# Base de conhecimento: schema OKF da wiki do mundo

A base de conhecimento do Game Copilot é **uma camada só**: a wiki `openwiki/` em formato **OKF v0.2** (markdown com frontmatter YAML estruturado + evidências), commitada no repositório. Cada página tem duas superfícies de leitura:

- **Frontmatter** — o que o motor de regras consome: o `knowledge-loader` parseia e monta o `KnowledgeIndex` em memória, que o `ProgressionAdvisor` consulta de forma determinística.
- **Prosa** — o que o agente `WorldAdvisor` lê para redigir recomendações com contexto e evidência.

Não existe `graph.ts` paralelo: a wiki é a única fonte, e o **schema desta wiki é a spec da base** — os tipos de página e os campos obrigatórios definidos aqui valem para o loader e para o agente.

## Tipos de página e campos obrigatórios

| `type` | Campos obrigatórios | Papel no domínio |
|---|---|---|
| `area` | `id`, `name`, `order`, `unlocks` | Mundo do mapa (Yoshi's Island, Donut Plains...) |
| `level` | `id`, `name`, `area`, `kind` (`main`/`side`), `exits`, `prerequisites`, `rewards`, `boss` | Fase/castelo — o nó do progresso |
| `switch-palace` | `id`, `name`, `unlocks` | Ativa blocos "!" que desbloqueiam caminhos |
| `power-up` | `id`, `name`, `effect`, `recommended-for` | O "equipamento" sugerido pelos advisors |
| `boss` | `id`, `name`, `castle`, `defeated-unlocks` | Chefe de castelo/fortaleza |

### Shape de um `level` (decisão de schema)

```yaml
---
type: level
id: forest-of-illusion-4
name: Forest of Illusion 4
area: forest-of-illusion
kind: main
exits:
  - kind: normal
    goes-to: forest-of-illusion-3
  - kind: secret
    goes-to: forest-secret-area
    requirement: keyhole
prerequisites: [forest-of-illusion-2]
rewards: [dragon-coin]
boss: false
---
```

## Regras

- **Fail fast**: página com campo obrigatório faltando ou inválido derruba o load, apontando arquivo + campo — nunca skip silencioso. Dado faltando no índice vira recomendação errada.
- **Provenance**: toda página carrega `sources` (detonado e/ou Super Mario Wiki) — dica sem evidência não é publicada.
- **Identificadores**: inglês kebab-case (`forest-of-illusion-4`); prosa em português.
