---
title: "Quickstart — como usar esta wiki"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:26:03.041Z
sources:
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
generated: { by: "opencode", at: "2026-11-16T17:26:03.041Z" }
---

# Quickstart — como usar esta wiki

Esta wiki é a **documentação viva do Game Copilot** — o hands-on da aula 2 do curso DIO de Spec-Driven Development: um assistente de gameplay que consome a telemetria do jogo (MQTT), infere o perfil do jogador e publica recomendações por um motor de regras determinístico e por um agente LLM.

## Mapa das páginas

| Página | O que responde |
|---|---|
| `overview.md` | O projeto das duas aulas, a tese e os non-goals |
| `hands-on/contracts.md` | Componentes do sistema e os contratos (eventos, tópicos, perfis, recomendações) |
| `hands-on/stages.md` | Os 10 estágios, branches empilhadas, política de main e o tracker de issues |
| `knowledge/schema.md` | O schema OKF da base de conhecimento (tipos de página e campos obrigatórios) |
| `knowledge/world-map.md` | O mundo de Super Mario World curado e o momento da demo |

## Como recuperar

Agentes usam **retrieval sob demanda**: `openwiki_search` para localizar a seção relevante (ex.: "qual o payload de game/recommendations?", "como o profiler infere o perfil?") e `openwiki_read` para ler a seção completa. Não há necessidade de ler a wiki inteira antes de qualquer tarefa.

## Quando a wiki atualiza

A wiki segue o processo do OpenWiki (`begin` → plano → páginas → `finish`) e é regenerada por estágio: cada branch `feature/NN-...` atualiza as páginas afetadas pelo código novo. A wiki nunca substitui o código e os testes — eles são a autoridade; ela é o índice com evidência.
