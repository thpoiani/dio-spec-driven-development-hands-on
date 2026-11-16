# Game Copilot

Assistente de gameplay: **telemetria de gameplay → barramento de eventos → motor de regras determinístico → recomendações no console**. Desenvolvido em estágios, um por ticket, cada um passando pelo ciclo das Skills do Matt Pocock (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`).

> Curso: [Spec-Driven Development (DIO)](https://github.com/thpoiani/dio-spec-driven-development).

## Como executar

Requisitos: **Node 22+** e npm.

```bash
npm install
```

### Demo (o momento canônico)

As três fitas de playthrough (jogadores `casual`, `completionist` e `speedrunner`) rodam em sequência contra o barramento in-memory:

```bash
npm run demo
```

Uma fita específica, acelerada (o recomendado para ver o loop do casual na Forest of Illusion):

```bash
npm run demo -- fita=casual speed=2
```

### App Nest

Bootstrap do módulo Nest com o barramento e os consumidores registrados:

```bash
npm start
```

### Qualidade

```bash
npm test             # suíte (vitest)
npm run test:watch   # suíte em watch
npm run typecheck    # tsc --noEmit
npm run check:wiki   # valida o schema da wiki OpenWiki
```

## O que roda hoje (`v0.6`)

| Componente | O que faz |
|---|---|
| **EventBus in-memory** | `@nestjs/event-emitter`: publicação síncrona, entrega em série, isolamento de falha entre assinantes |
| **PlayerProfiler** | infere o perfil (`casual`, `completionist`, `speedrunner`) pela agregação dos eventos com timestamps |
| **ProgressionAdvisor** | gating (o loop da Forest of Illusion), power-up por contexto, objetivo da área — com `source` e `evidence` da wiki |
| **knowledge-loader** | wiki OpenWiki (OKF) → `KnowledgeIndex`, fail fast por arquivo/campo |
| **Console UI** | imprime perfis e recomendações com a origem e a evidência |

O contrato de eventos (7 tópicos, payloads tipados) está em `src/domain/events/game-events.ts` e documentado no [ARCHITECTURE.md](./ARCHITECTURE.md).

## Estrutura

```text
src/
├── domain/          # puro, sem Nest: tipos de evento, regras do profiler, KnowledgeIndex
├── application/     # serviços Nest: EventBus, profiler, advisor
├── infrastructure/  # adapters: knowledge-loader
├── presentation/    # console-ui
└── game/            # fitas de playthrough (JSON), runner e demo
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [SCOPE.md](./SCOPE.md) | Escopo, decisões, non-goals, estágios |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura, componentes, contratos (eventos, perfis), fitas de demo |
| [slides/outline.md](./slides/outline.md) | Esqueleto da apresentação (skill dio-slides) |
| [AGENTS.md](./AGENTS.md) | Guia para sessões de agente: estado, fluxo, decisões vinculantes |

## Como acompanhar

- **Issues**: specs e tickets de cada estágio (issue-pai + sub-issues com dependências nativas) — labels `ready-for-agent` / `ready-for-human`.
- **Pull Requests**: um PR por ticket, merged em ordem — os PRs merged são a evolução do projeto (as branches são removidas após o merge).
- **Wiki**: `openwiki/` (OpenWiki, formato OKF) — a base de conhecimento do mundo do jogo (Super Mario World).
