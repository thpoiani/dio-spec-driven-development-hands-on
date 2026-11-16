# SCOPE · Game Copilot

> Documento de escopo do projeto. Decisões registradas em sessão de planejamento (nov/2026).
> Detalhes de arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md).

## 1. Contexto e tese

O projeto segue **Spec-Driven Development** com as Skills do Matt Pocock: o mesmo ciclo (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`) aplicado a um sistema real, com arquitetura, eventos e evolução de infraestrutura.

**Tese**: features em sistema existente são onde o SDD brilha de verdade — e o operador responde com decisões de negócio próprias; o método transforma cada resposta em requisito testável.

## 2. Gancho de mercado

- **Grand Theft Auto VI** lançado em **19/11/2026** (PlayStation 5 / Xbox Series X|S) — o vídeo é gravado antes do release e publicado depois. Lançamento com audiência massiva: o jogador busca estratégia sem sair do jogo.
- Tendência associada: **sistemas operacionais para TV** que removem ads e telemetria e melhoram performance (ex.: [cleanyour.tv](https://cleanyour.tv/)) — a TV como plataforma computacional aberta.
- **Problem statement** (do briefing):

> **Oportunidade**: lançamentos de jogos com audiência massiva.
> **Problema**: jogadores enfrentam sobrecarga de informações ao buscar estratégias sem tempo real para jogos complexos, necessitando de pausas constantes.
> **Impacto**: interrupção da imersão e redução do engajamento.
> **Solução**: análise de contexto de gameplay em tempo real, entregando dicas e estratégias personalizadas ao jogador.

## 3. O sistema: Game Copilot

Um assistente de jogador que consome a **telemetria de gameplay** (eventos publicados num broker), infere o **perfil do jogador**, cruza com uma **base de conhecimento do mundo do jogo** (wiki) e publica **recomendações human-readable** — por um motor de regras determinístico.

O jogo é **Super Mario World** (reconhecimento imediato da plateia, pré-requisitos reais e legíveis). A captura/análise de screenshot fica fora do escopo: o sistema **começa nos eventos**, que são mockados por "playthroughs" (fitas de eventos que simulam sessões reais de jogo). A mensagem explícita do projeto: *"amanhã você pluga o jogo que quiser na mesma interface"*.

## 4. Decisões registradas

| # | Decisão | Escolha | Motivo |
|---|---|---|---|
| 1 | Tese | O contrato primeiro, as decisões com o dono | A spec orienta a implementação |
| 2 | Divisão offline vs. evolução | Core pronto offline; a evolução = features via ciclo SDD completo | A evolução ensina o ciclo, não a digitação |
| 3 | Jogo da base de conhecimento | Super Mario World | Plateia conhece; gating por Switch Palaces/saídas secretas é didático; Sonic tem pré-requisito fraco |
| 4 | Camada de conhecimento | **Uma só**: wiki em formato OKF v0.2 (langchain-ai/openwiki), commitada no repo | Sem `graph.ts` paralelo: frontmatter = dado estruturado do motor; prosa = leitura rica; sem drift entre camadas |
| 5 | Autoria da wiki | OpenWiki + OpenCode (integração nativa) a partir de um detonado | Mesmo agente do curso; OKF portável; visualizador de grafo para slide |
| 7 | Perfis de jogador | `completionist`, `speedrunner`, `casual` | Vocabulário Mario; inferíveis a partir dos eventos (com timestamps) |
| 9 | Vocabulário | Eventos e componentes no domínio Mario (`level_started`, `boss_engaged`, power-ups) | Glossário registra; Avoid: "quest", "batalha" |
| 10 | Postura do operador | Responder com decisões próprias | O método transforma cada resposta em requisito testável |
| 11 | Terminal nas demos | Execução real, acelerada na edição quando necessário | A execução fica dinâmica; a entrevista é o conteúdo |
| 12 | Branches | Removidas após o merge; os PRs merged preservam o histórico; `main` sempre final | GitHub navegável; os PRs contam a evolução |

## 5. Non-goals (explícitos nas specs)

- ❌ Captura e análise de screenshot real (OCR/vision) — o sistema começa nos eventos mockados.
- ❌ LLM no caminho determinístico — `PlayerProfiler` e `ProgressionAdvisor` são regras puras.
- ❌ UI/overlay — o sistema termina nas recomendações textuais no console.

## 6. Estágios, tickets e PRs

O desenvolvimento acontece em **10 estágios** (que organizam as issues) e em **tickets** (a unidade de trabalho). O projeto é **NestJS** com camadas **DDD** (`domain/` puro sem Nest · `application/` serviços · `infrastructure/` adapters · `presentation/` console). Cada **ticket** tem uma branch própria (`ticket/<issue>-<slug>`) e um **PR próprio** para a `main`, com `Closes #N` no corpo — o merge fecha o sub-issue correspondente. O merge acontece no fechamento do ticket (TDD/review verdes); a branch é **removida após o merge** (o PR merged preserva o histórico); a `main` recebe a evolução ticket a ticket — sempre verde.

| # | Estágio (issue-pai) | Entregável | Quando | Tag |
|---|---|---|---|---|
| 01 | #1 `knowledge-base` | Wiki OpenWiki do SMW (OKF): schema + mundo + entidades | Offline, com apoio do agente | `v0.1` ✅ |
| 02 | issue do estágio | **Bootstrap NestJS + DDD**: tipos de evento + EventBus (`@nestjs/event-emitter`, in-memory síncrono) | Offline | `v0.2` |
| 03 | issue do estágio | `knowledge-loader`: OKF → `KnowledgeIndex` (fail fast) + fixtures | Offline | `v0.3` |
| 04 | issue do estágio | `PlayerProfiler` (3 perfis) + `ProgressionAdvisor` (services `@OnEvent`) | Offline | `v0.4` |
| 05 | issue do estágio | 3 fitas (JSON) + runner com `--speed` + console + `npm run demo` — **barramento in-memory** (sem broker, sem docker) | Offline | `v0.5` |
| 06 | issue do estágio | **Upgrade NestJS 11 → 12**: os `@nestjs/*` na v12 (ESM-only — nosso `type: module` ✓), o migration guide revisado (hook ordering, lifecycle), a suíte verde; a **observabilidade nativa** (`@nestjs/observe`) fica disponível para quando o projeto precisar | Offline | `v0.6` |
- O projeto é este repositório; **cada ticket = branch + PR** com `Closes #N`; o merge acontece no fechamento do ticket e a branch é removida — os PRs merged, em ordem, são a evolução do curso.
- O estágio 06 é o **upgrade NestJS 12** (o migration guide revisado); os estágios seguintes são definidos em sessão de trabalho.
- `@setup-matt-pocock-skills` na raiz ✅ (tracker **GitHub Issues**, labels de triagem, single-context).

## 7. Checklist de execução

O checklist vivo (o que está feito, o que falta) mora em **uma fonte só**: [`AGENTS.md`](./AGENTS.md) §Estado atual — consulte lá. Esta seção guardava a cópia e foi podada para não duplicar.

## 8. Referências

- **Fontes do jogo (etapa 01)**: [Detonado PC do Paulo](https://www.pcdopaulo.com/2024/09/detonado-super-nintendo-super-mario.html) · [Super Mario Wiki — Secret exit](https://www.mariowiki.com/Secret_exit) · [SM Wiki — Super Mario World](https://www.mariowiki.com/Super_Mario_World) · [YouTube — Saídas Secretas](https://www.youtube.com/watch?v=KjhSUdv5Lwo)

- [Matt Pocock Skills](https://github.com/mattpocock/skills) · [OpenCode](https://opencode.ai/docs)
- [langchain-ai/openwiki](https://github.com/langchain-ai/openwiki) · [Open Knowledge Format (OKF) v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [cleanyour.tv](https://cleanyour.tv/) · [Rockstar — GTA VI 19/11/2026](https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026)
- Curso DIO: [README](https://github.com/thpoiani/dio-spec-driven-development) · [slides](https://github.com/thpoiani/dio-spec-driven-development/tree/main/slides)
