# INSTRUCTIONS.md — brief da wiki

Este repositório é o **Game Copilot**: o hands-on da aula 2 do curso DIO de Spec-Driven Development — assistente de gameplay com telemetria mockada, MQTT, motor de regras determinístico e agente LLM, desenvolvido em 10 estágios (um por branch) passando pelo ciclo das Skills do Matt Pocock.

## Prioridades e escopo das páginas

1. Documente o **Game Copilot**: componentes, contratos, estágios e a base de conhecimento do mundo do jogo.
2. Fontes de verdade (evidência preferencial dos Claims): `SCOPE.md` (escopo, decisões, non-goals), `ARCHITECTURE.md` (arquitetura e contratos), `PRESENTATION.md` (roteiro) e os issues do estágio no GitHub.
3. **Idioma**: português (pt-BR). Identificadores canônicos de código/conhecimento em inglês kebab-case.

## Vocabulário do domínio (obrigatório)

- Perfis: `casual`, `completionist`, `speedrunner`.
- Eventos: `area_entered`, `level_started`, `level_completed`, `inventory_opened`, `boss_engaged`.
- Componentes: `EventBus` (interface) · `InMemoryEventBus`/`MqttEventBus` · `PlayerProfiler` · `ProgressionAdvisor` · `WorldAdvisor` · `knowledge-loader` · `console-ui`.
- **Avoid**: "quest" (Mario tem fases/objetivos), "batalha" (é `boss_engaged`), "grafo tipado" (a wiki OpenWiki/OKF é a única camada de conhecimento).

## Non-goals do projeto (não apresentar como planos)

Captura/OCR de screenshot; LLM fora do `WorldAdvisor`; UI/overlay; Kafka/RabbitMQ; agente reagindo a cada evento.

## Notas de geração

- Evidência dos Claims: aponte para os arquivos de documentação na raiz (`repo://SCOPE.md`, `repo://ARCHITECTURE.md`) e, quando existirem, para código/testes.
- Os estágios 08 e 09 são gravados ao vivo na aula; páginas sobre eles descrevem o contrato planejado, não código existente.
- A Special Zone é o homework (`feature/10-knowledge-expansion`) — fora do escopo das páginas de conhecimento.
