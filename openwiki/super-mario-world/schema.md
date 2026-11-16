---
title: "Super Mario World — schema do conhecimento"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T19:04:45.295Z
sources:
  - id: openwiki-source-362e06c30ccfdafd87339cb0
    resource: repo://ARCHITECTURE.md
generated: { by: "opencode", at: "2026-11-16T17:58:26.636Z" }
---

# Super Mario World — schema do conhecimento

O conhecimento de Super Mario World nesta wiki é organizado em cinco tipos de página. Cada página é markdown com frontmatter YAML estruturado (os campos obrigatórios abaixo) + prosa em português com a evidência da fonte. Identificadores em inglês kebab-case (`forest-of-illusion-4`, `cape-feather`).

## Tipos de página

| `type` | Campos obrigatórios | Papel |
|---|---|---|
| `area` | `id`, `name`, `order`, `unlocks` | Mundo do mapa (Yoshi's Island, Donut Plains, Forest of Illusion...) |
| `level` | `id`, `name`, `area`, `kind` (`main`/`side`), `exits`, `prerequisites`, `rewards`, `boss` | Fase/castelo — o nó do progresso |
| `switch-palace` | `id`, `name`, `unlocks` | Ativa blocos "!" que desbloqueiam caminhos |
| `power-up` | `id`, `name`, `effect`, `recommended-for` | O item que os jogadores levam para cada contexto |
| `boss` | `id`, `name`, `castle`, `defeated-unlocks` | Chefe de castelo/fortaleza |

## Shape canônico de um `level`

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

## Convenções

- `exits` declara **todas** as saídas da fase (`normal` e/ou `secret`/`keyhole`), com o destino (`goes-to`) e o requisito quando houver — o gating do mundo é derivado daqui.
- `prerequisites` lista o que precisa estar concluído antes do nível estar acessível.
- **Provenance obrigatória**: toda página carrega `sources` (detonado e/ou Super Mario Wiki) — afirmação sem fonte não é conhecimento.
- Prosa em português; nenhum campo fora do schema (página fora do schema é erro de validação, não conteúdo aceito).
