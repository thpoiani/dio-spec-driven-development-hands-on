---
title: "O projeto do curso: do estudo comparativo ao Game Copilot"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:26:03.041Z
sources:
  - id: openwiki-source-97a2e216f8d4144eda683e4e
    resource: repo://SCOPE.md
generated: { by: "opencode", at: "2026-11-16T17:26:03.041Z" }
---

# O projeto do curso: do estudo comparativo ao Game Copilot

Este repositório é o hands-on da aula 2 do curso **Spec-Driven Development (DIO)**. A aula 1 provou, com o experimento dos 4 placares (4/10 em todos os métodos — baseline, Spec Kit, OpenSpec e Matt Pocock Skills), que **o gargalo do SDD é quem especifica, não o método**. A aula 2 é o contraponto prático: **o mesmo ciclo das Skills do Matt Pocock** (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`) aplicado a um sistema real — com arquitetura, eventos, evolução de infraestrutura e agentes LLM.

A postura do operador também muda: na aula 1 ele **aceitava as recomendações** (e o placar mostrou o gargalo); na aula 2 ele **responde de verdade**, com decisões de negócio próprias, e o método transforma cada resposta em requisito testável.

## Gancho de mercado

**Grand Theft Auto VI** lançado em 19/11/2026 com audiência massiva — o jogador busca estratégia sem sair do jogo — e a TV como plataforma computacional aberta (sistemas operacionais para TV que removem ads/telemetria, como o cleanyour.tv). O Game Copilot é a mesma tendência aplicada ao jogador.

## O sistema

O **Game Copilot** consome a **telemetria de gameplay** (eventos publicados num broker), infere o **perfil do jogador** (`casual`, `completionist`, `speedrunner`), cruza com a **base de conhecimento do mundo do jogo** (a wiki `openwiki/`, OKF) e publica **recomendações human-readable** — por um motor de regras determinístico **e** por um agente LLM.

O jogo da base é **Super Mario World** — reconhecimento imediato da plateia e pré-requisitos reais e legíveis (Switch Palaces, keyholes, secret exits). A captura de screenshot fica fora de escopo: a aula **começa nos eventos**, mockados por playthroughs — *"amanhã você pluga o jogo que quiser na mesma interface"*.

## Non-goals

- Sem captura/OCR de screenshot (a análise visual é outro projeto).
- LLM **só** no `WorldAdvisor` — profiler e progression advisor são regras puras.
- Sem UI/overlay: o sistema termina nas recomendações textuais do console.
- Sem Kafka/RabbitMQ (Mosquitto/MQTT de uma linha resolve) e sem o agente reagindo a cada evento.

## Onde continuar

- Contratos e componentes: `openwiki/hands-on/contracts.md`
- Estágios, branches e tracker: `openwiki/hands-on/stages.md`
- Base de conhecimento: `openwiki/knowledge/schema.md` e `openwiki/knowledge/world-map.md`
