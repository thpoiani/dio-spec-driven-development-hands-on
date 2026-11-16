# Game Copilot — Aula 2 (hands-on) do curso DIO de Spec-Driven Development

Assistente de gameplay: **telemetria de gameplay → MQTT → consumidores (regras determinísticas + agente LLM) → recomendações no console**. Desenvolvido em 10 estágios, um por branch, cada um passando pelo ciclo das Skills do Matt Pocock (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`).

> Curso: [Spec-Driven Development (DIO)](https://github.com/thpoiani/dio-spec-driven-development) — aula 1: estudo comparativo (o mesmo prompt em 4 execuções, placar 4/10).

## Documentação

| Documento | Conteúdo |
|---|---|
| [SCOPE.md](./SCOPE.md) | Escopo, decisões, non-goals, estágios e checklist de execução |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura, componentes, contratos (eventos, tópicos, perfis) e base de conhecimento |
| [PRESENTATION.md](./PRESENTATION.md) | Roteiro da gravação da aula e esqueleto de slides |
| [AGENTS.md](./AGENTS.md) | Guia para sessões de agente: estado, fluxo, decisões vinculantes e skills |

## Como acompanhar

- **Issues**: specs e tickets de cada estágio (issue-pai + sub-issues com dependências nativas) — labels `ready-for-agent` / `ready-for-human`.
- **Pull Requests**: um PR por estágio, empilhados (base = branch anterior), abertos para análise — o merge acontece só no cenário final.
- **Wiki**: `openwiki/` (OpenWiki, formato OKF) — a base de conhecimento do mundo e a documentação viva do projeto.
