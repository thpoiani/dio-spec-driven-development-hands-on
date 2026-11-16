---
title: "Estágios, branches e tracker"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:26:03.041Z
sources:
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-13dd5d4bbac0d2d6ce41730f
    resource: repo://docs/agents/issue-tracker.md
  - id: openwiki-source-97a2e216f8d4144eda683e4e
    resource: repo://SCOPE.md
generated: { by: "opencode", at: "2026-11-16T17:26:03.041Z" }
---

# Estágios, branches e tracker

O desenvolvimento acontece em **10 estágios**, um por branch — empilhados: cada estágio nasce da branch do estágio anterior. Cada estágio tem **spec própria como Issue no GitHub** (issue-pai + tickets como sub-issues com dependências nativas) e commits atômicos que contam a história (spec → tickets → código).

## Os 10 estágios

| # | Branch | Entregável | Quando |
|---|---|---|---|
| 01 | `feature/01-knowledge-base` | Setup OpenWiki + detonado → `openwiki/` OKF | Offline, com apoio do agente |
| 02 | `feature/02-events-bus` | Tipos de evento + interface `EventBus` + `InMemoryEventBus` | Offline |
| 03 | `feature/03-knowledge-loader` | OKF → `KnowledgeIndex` (fail fast) | Offline |
| 04 | `feature/04-player-profiler` | `PlayerProfiler` + `game/profile_changed` | Offline |
| 05 | `feature/05-progression-advisor` | Regras + `game/recommendations` | Offline |
| 06 | `feature/06-playthroughs-demo` | 3 fitas + `--speed` + console + `npm run demo` | Offline |
| 07 | `feature/07-observability` | OTel (traces por sessionId) + OpenObserve | Offline |
| 08 | `feature/08-event-broker` | Broker MQTT como migração guiada por spec | **Gravada ao vivo** |
| 09 | `feature/09-world-advisor` | `WorldAdvisor` agente LangChain | **Gravada ao vivo** |
| 10 | `feature/10-knowledge-expansion` | Expansão do mundo (Star Road / Special Zone) | **Homework** dos alunos |

## Política de repositório

- **Nada vai para a `main` até o cenário final** — incluindo o que será gravado. O merge final é feito pelo Thiago.
- Branches **nunca são deletadas**: a lista numerada conta a história do projeto para quem acompanhar o curso.
- Cada estágio abre um **PR empilhado** (base = branch do estágio anterior) que mostra só o diff da etapa — fica aberto para os alunos analisarem.
- Tags `v0.1` … `v1.0` marcam o fechamento de cada estágio.

## Tracker (GitHub Issues)

- A spec de cada estágio é um **issue-pai**; os tickets são **sub-issues** com **dependências nativas** (`blocked-by`) — um ticket só começa quando todos os blockers estão fechados.
- Labels de triagem: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
- As etapas 08 e 09 são **gravadas ao vivo** na aula (a entrevista `@grill` ao vivo, o terminal acelerado na edição); o estágio 10 é o homework, com spec + tickets pré-produzidos.
