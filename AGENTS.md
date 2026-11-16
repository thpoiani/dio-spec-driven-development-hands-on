# AGENTS.md · Game Copilot (aula 2 — hands-on SDD)

Projeto da segunda aula do curso DIO de Spec-Driven Development: assistente de gameplay com telemetria mockada, MQTT, motor de regras e agente LLM. O curso e a aula 1 (estudo comparativo) vivem em `thpoiani/dio-spec-driven-development`.

## Fontes de verdade (leia antes de qualquer trabalho)

| Documento | O que define |
|---|---|
| [SCOPE.md](./SCOPE.md) | Escopo, tese, as 13 decisões registradas, non-goals, estágios e checklist |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Componentes, contratos (eventos, tópicos MQTT, perfis), base de conhecimento, fitas de demo, testes |
| [PRESENTATION.md](./PRESENTATION.md) | Roteiro de gravação, protocolo (ao vivo vs. acelerado), esqueleto de slides |

Em conflito entre código e documentos, **os documentos vencem** — e devem ser atualizados se uma decisão mudar (decisões são do Thiago; registre na tabela do SCOPE.md §4).

## Estado atual (atualize esta seção a cada etapa concluída)

- [x] Bootstrap: documentação + scaffold (TS strict + Vitest, zero deps no core) + `@setup-matt-pocock-skills` (tracker **GitHub Issues** + labels de triagem, single-context: `GLOSSARY.md` + `docs/adr/`)
- [~] **Etapa 01 — em andamento**: spec publicada como **Issue #1** (`ready-for-human`); tickets #2–#7 como sub-issues com dependências nativas. Setup do OpenWiki em curso (Ticket #2); pendente: ingestão do detonado (PC do Paulo) + validação contra a Super Mario Wiki
- [ ] Etapa 02 — eventos + interface `EventBus` + `InMemoryEventBus`
- [ ] Etapa 03 — `knowledge-loader`: OKF → `KnowledgeIndex` (fail fast)
- [ ] Etapa 04 — `PlayerProfiler` (casual/completionist/speedrunner) + `ProgressionAdvisor`
- [ ] Etapa 05 — `game/recommendations` + playthroughs + `npm run demo` + testes
- [ ] Etapa 06/07 — observabilidade (OTel + OpenObserve, traces por sessionId)
- Itens 08–10: 08/09 são **gravação** (ver fluxo abaixo) e 10 é o homework — spec + tickets pré-produzidos por agente quando o resto estiver estável.

## Fluxo de trabalho por etapa

1. **Uma etapa por vez, na ordem dos estágios 01→10** (tabela no `SCOPE.md` §6). Cada estágio = uma branch numerada, **empilhada sobre a anterior** (nasce da branch do estágio anterior), com **spec própria como Issue no GitHub** (issue-pai + tickets como sub-issues com dependências nativas) e commits atômicos que contam a história (spec → tickets → código). **Nenhuma branch é deletada e nada vai para a `main` até o cenário final** — o merge final é feito pelo Thiago. PR de cada etapa fica aberto (base = branch anterior) para os alunos analisarem. Tags `v0.1` … `v1.0` por estágio.
2. Etapas com conteúdo de conhecimento (01, 10) são **manuais com apoio do agente** (Thiago roda o OpenWiki; o agente converte/valida páginas). Estágios de código seguem TDD.
3. Os **estágios 08 (broker) e 09 (agente)** só existem como *gravação* — se estiver trabalhando neles fora de gravação, pare no preparo dos artefatos e confirme com o Thiago.

## Decisões vinculantes (não reabrir sem o Thiago)

- **Jogo**: Super Mario World. Vocabulário Mario em código, wiki e glossário — *Avoid*: "quest", "batalha" (são `level`, `boss_engaged`, power-ups).
- **Camada de conhecimento única**: `openwiki/` no formato OKF v0.2, commitada. O motor de regras consome o **frontmatter** (via knowledge-loader); o agente consome a **prosa**. Não criar `graph.ts` paralelo.
- **Broker**: Mosquitto (MQTT) em docker-compose; `InMemoryEventBus` permanece para testes — a interface `EventBus` é a seam.
- **LLM só no WorldAdvisor**: `PlayerProfiler` e `ProgressionAdvisor` são regras puras, determinísticos e testáveis. Non-goal: agente reagir a cada evento.
- **Zero deps no core** (bootstrap); dependências externas (`mqtt.js`, LangChain, OpenTelemetry, Mosquitto) entram a partir das etapas 07/08.
- **Perfis**: `casual`, `completionist`, `speedrunner` — inferidos por agregação de eventos (com timestamps), publicados como `game/profile_changed`.

## Contratos e detalhes

- Formato dos eventos, tópicos MQTT, payload de recomendação, estrutura das páginas OKF e das fitas de demo: ver **ARCHITECTURE.md** §4–§6 — implemente exatamente esses contratos.
- Non-goals da aula (não implementar): captura/OCR de screenshot, LLM no caminho determinístico, UI, Kafka/RabbitMQ, agente reagindo a cada evento.

## Agent skills

### Issue tracker

Issues and specs live as **GitHub Issues** on this repository (público; `gh` CLI). Spec = issue-pai do estágio; tickets = sub-issues com dependências nativas. PRs das etapas ficam abertos para os alunos (não são surface de triagem). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role triage vocabulary, label strings equal to their names. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the project root. See `docs/agents/domain.md`.

### Naming

The `Avoid:` lists in `GLOSSARY.md` bind identifiers too — reviewers treat them as the naming standard. Vocabulário do domínio é o do jogo (Super Mario World): *Avoid* "quest" e "batalha" — see `GLOSSARY.md` (criado pelo `/domain-modeling`) e `SCOPE.md` §4.
