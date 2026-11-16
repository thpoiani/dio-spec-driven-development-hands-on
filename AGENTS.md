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
- [x] **Etapa 01 — concluída** (`v0.1`): wiki OpenWiki do SMW — 39 páginas com schema completo, Claims com evidência (Issue #1 fechada)
- [x] **Etapa 02 — concluída** (`v0.2`): bootstrap NestJS + DDD (domain puro sem Nest) + tipos de evento + EventBus in-memory (`@nestjs/event-emitter`) — PRs #17/#18, CI verde
- [x] **Etapa 03 — concluída** (`v0.3`): knowledge-loader (OKF → `KnowledgeIndex`, fail fast) + integração com as 36 páginas reais de SMW
- [x] **Etapa 04 — concluída** (`v0.4`): `PlayerProfiler` (a inferência dos 3 perfis com thresholds explícitos) + `ProgressionAdvisor` (o gating, o power-up, o objetivo — com `source`/`evidence`) — PRs #25/#26
- [ ] Etapa 05 — fitas de playthrough (JSON) + console + `npm run demo` — **barramento in-memory** (o MQTTX entra na migração, etapa 07)
- [ ] Etapa 06 — observabilidade (`nestjs-otel` + OpenObserve, traces por sessionId)
- [ ] Etapa 07 — **gravação**: migração MQTT (EMQX com E2E tracing + `traceparent` via User-Property)
- [ ] Etapa 08 — **gravação**: `WorldAdvisor` (agente LangChain + Ollama local, Nest provider)
- [ ] Etapa 09 — **homework**: expansão do mundo (Star Road / Special Zone) — spec + tickets pré-produzidos quando o resto estiver estável

## Fluxo de trabalho por etapa

1. **Um ticket por vez, na ordem da fronteira** (issues com blockers fechados, ver §6). Cada **ticket** = uma branch `ticket/<issue>-<slug>` + um **PR próprio** para a `main` com `Closes #N` no corpo — o merge no fechamento do ticket (verde: TDD/review) mantém a `main` sempre com código funcional. Branches **nunca são deletadas**; PRs merged continuam acessíveis e, em ordem, contam a evolução do curso.
2. Etapas com conteúdo de conhecimento (01, 10) são **manuais com apoio do agente** (Thiago roda o OpenWiki; o agente converte/valida páginas). Estágios de código seguem TDD.
3. Os **estágios 08 (broker) e 09 (agente)** só existem como *gravação* — se estiver trabalhando neles fora de gravação, pare no preparo dos artefatos e confirme com o Thiago.

## Decisões vinculantes (não reabrir sem o Thiago)

- **Jogo**: Super Mario World. Vocabulário Mario em código, wiki e glossário — *Avoid*: "quest", "batalha" (são `level`, `boss_engaged`, power-ups).
- **Camada de conhecimento única**: `openwiki/` no formato OKF v0.2, commitada, **organizada por jogo** (`openwiki/<game-slug>/` — jogo novo = pasta nova). O motor de regras consome o **frontmatter** (via knowledge-loader); o agente consome a **prosa**. Não criar `graph.ts` paralelo. **A wiki contém apenas conhecimento de jogo** — nada de documentação de projeto.
- **Broker**: EMQX (MQTT) em docker-compose; `InMemoryEventBus` permanece para testes — a interface `EventBus` é a seam.
- **LLM só no WorldAdvisor**: `PlayerProfiler` e `ProgressionAdvisor` são regras puras, determinísticos e testáveis. Non-goal: agente reagir a cada evento.
- **Zero deps no core** (bootstrap); dependências externas (`mqtt.js`, LangChain, OpenTelemetry, EMQX) entram a partir das etapas 07/08.
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

<!-- OPENWIKI:START -->

## OpenWiki

This repository has a generated `openwiki/` evidence index. It is optional just-in-time context, not required startup reading.

- Do not enumerate, preload, or search wikis at task start. Use retrieval when the user asks for it, when unfamiliar architecture or dependency behavior materially affects the task, or when source inspection leaves an important uncertainty. Stop once the question is grounded.
- When those conditions apply and OpenWiki retrieval tools are available, use `openwiki_search` for just-in-time context and `openwiki_read` for the relevant complete sections. If search returns `workspace_required`, ask which listed workspace to use and retry with its ID.
- Use `openwiki_list_workspaces` or `openwiki_list_wikis` when workspace membership itself needs to be discovered.
- If the retrieval tools are unavailable, read `openwiki/quickstart.md` and follow its links to the relevant pages.
- Treat source code and tests as authoritative. A brief's unknowns and review items are verification gaps, not automatic requirements.
- Prefer the narrowest quiet validation that proves the changed behavior. Preserve complete failure output.

Use the repository's documented maintenance process to refresh generated pages after source changes. Check its configuration and completed runs before relying on automatic updates. Do not hand-edit generated OpenWiki pages unless explicitly asked; prefer updating source code/docs and letting OpenWiki regenerate.

<!-- OPENWIKI:END -->
