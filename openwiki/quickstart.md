---
title: "Quickstart — base de conhecimento dos jogos"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:58:26.636Z
sources:
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-362e06c30ccfdafd87339cb0
    resource: repo://ARCHITECTURE.md
generated: { by: "opencode", at: "2026-11-16T17:58:26.636Z" }
---

# Quickstart — base de conhecimento dos jogos

Esta wiki é a **base de conhecimento dos jogos** do Game Copilot: mundo, progressão, gating, itens e estratégias — organizada por título do jogo, uma pasta por jogo. Contém **apenas conhecimento de jogo**; a documentação do projeto vive nos docs da raiz do repositório.

## Jogos nesta wiki

| Jogo | Pasta | Estado |
|---|---|---|
| Super Mario World | `super-mario-world/` | em construção — schema e mundo curado; entidades em ingestão |

- **`super-mario-world/schema.md`** — os tipos de página (`area`, `level`, `switch-palace`, `power-up`, `boss`) e campos obrigatórios.
- **`super-mario-world/world-map.md`** — áreas, gating (secret exits/keyholes/Switch Palaces), power-ups, bosses e fontes.

## Como adicionar um jogo novo

1. Crie a pasta `openwiki/<game-slug>/` com o slug do título.
2. Escreva o `schema.md` do jogo: os tipos de página do domínio daquele jogo e os campos obrigatórios.
3. Registre as fontes (detonados/guias) e ingira as entidades com provenance (`sources`) — afirmação sem fonte não é conhecimento.
4. Prosa em português; identificadores em inglês kebab-case.

## Como recuperar

Agentes usam retrieval sob demanda: `openwiki_search` para localizar a seção (ex.: "o que desbloqueia a Star Road?") e `openwiki_read` para ler a seção completa. A wiki nunca substitui as fontes — ela é o conhecimento compilado com evidência.
