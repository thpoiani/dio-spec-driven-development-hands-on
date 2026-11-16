---
title: "Game Copilot: componentes e contratos"
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

# Game Copilot: componentes e contratos

O Game Copilot é um assistente de gameplay: uma simulação de jogo (o playthrough) publica **telemetria de gameplay** num barramento, consumidores processam essa telemetria — um motor de regras determinístico e um agente LLM — e as recomendações saem formatadas no console. Sem captura de screenshot nesta fase: a telemetria é mockada por "fitas" de eventos.

## Componentes

| Componente | Papel | Determinístico |
|---|---|---|
| `playthrough-runner` | Lê uma fita de eventos e publica no barramento, respeitando intervalos | sim |
| `EventBus` | Interface única de transporte — a seam do sistema | — |
| `InMemoryEventBus` | Implementação para testes e demo sem docker | sim |
| `MqttEventBus` | Implementação MQTT (etapa 08), sobre `mqtt.js` + Mosquitto | sim |
| `PlayerProfiler` | Agrega eventos e infere o perfil, publicando `game/profile_changed` | sim |
| `ProgressionAdvisor` | Regras sobre o `KnowledgeIndex`, publica `game/recommendations` | sim |
| `WorldAdvisor` | Agente LangChain (etapa 09): consome telemetria + perfil, consulta a wiki e publica recomendações ricas | não (LLM) |
| `knowledge-loader` | Parseia o frontmatter OKF de `openwiki/` e monta o índice em memória | sim |
| `console-ui` | Assina `game/recommendations` e imprime com a origem marcada | sim |

A regra de ouro: **o LLM entra apenas no `WorldAdvisor`**. Profiler e ProgressionAdvisor são regras puras — determinísticos, testáveis e instantâneos.

## Contratos

### Eventos de telemetria

Cinco tipos canônicos: `area_entered`, `level_started`, `level_completed` (com `durationMs` — alimenta o sinal de speedrunner), `inventory_opened` e `boss_engaged`. Tópicos: `game/telemetry/<tipo>`.

### Eventos derivados

- `game/profile_changed` — publicado pelo PlayerProfiler (primeira inferência e mudanças), com `profile`, `confidence` e `signals`.
- `game/recommendations` — publicado pelo ProgressionAdvisor e pelo WorldAdvisor, com `source`, `profile`, `message` e `evidence` (a página da wiki que fundamenta a dica).

O mesmo tópico atende os dois produtores: **regras e agente coexistem porque a spec definiu o contrato do evento**.

## Perfis de jogador

`casual` (poucas áreas, sem segredos, consultas frequentes de inventário), `completionist` (secret exits e Dragon Coins, coleta constante) e `speedrunner` (deltas curtos entre `level_started`/`level_completed`, direto ao objetivo). A inferência é agregação de eventos com timestamps — contagem, não linguagem.

## Vocabulário

O domínio é do jogo (Super Mario World): *Avoid* "quest" (são fases/objetivos) e "batalha" (é `boss_engaged`). Os identificadores canônicos desta wiki valem para código, testes e revisão.
