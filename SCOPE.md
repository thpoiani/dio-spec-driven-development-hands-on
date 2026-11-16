# SCOPE · Aula 2 — Hands-on SDD: Game Copilot

> Documento de escopo da segunda aula. Decisões registradas em sessão de planejamento (nov/2026).
> Detalhes de arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md) · roteiro de gravação em [PRESENTATION.md](./PRESENTATION.md).

## 1. Contexto e tese

A aula 1 provou, com o experimento dos 4 placares (4/10 em todos os métodos), que **o gargalo do SDD é quem especifica, não o método**. A aula 2 é o contraponto prático: **o mesmo ciclo das Skills do Matt Pocock** (`@grill-with-docs` → `@to-spec` → `@to-tickets` → `@implement`/`@tdd`/`@code-review` → `@retro`) aplicado a um sistema real, com arquitetura, eventos e evolução de infraestrutura.

**Tese da aula**: features em sistema existente são onde o SDD brilha de verdade — e a postura do operador muda: na aula 1 eu *aceitava as recomendações* (e o placar mostrou o gargalo); na aula 2 **eu respondo de verdade**, com decisões de negócio próprias, e o método transforma cada resposta em requisito testável.

## 2. Gancho de mercado

- **Grand Theft Auto VI** lançado em **19/11/2026** (PlayStation 5 / Xbox Series X|S) — o vídeo é gravado antes do release e publicado depois. Lançamento com audiência massiva: o jogador busca estratégia sem sair do jogo.
- Tendência associada: **sistemas operacionais para TV** que removem ads e telemetria e melhoram performance (ex.: [cleanyour.tv](https://cleanyour.tv/)) — a TV como plataforma computacional aberta.
- **Problem statement** (do briefing da aula):

> **Oportunidade**: lançamentos de jogos com audiência massiva.
> **Problema**: jogadores enfrentam sobrecarga de informações ao buscar estratégias sem tempo real para jogos complexos, necessitando de pausas constantes.
> **Impacto**: interrupção da imersão e redução do engajamento.
> **Solução**: análise de contexto de gameplay em tempo real, entregando dicas e estratégias personalizadas ao jogador.

## 3. O sistema: Game Copilot

Um assistente de jogador que consome a **telemetria de gameplay** (eventos publicados num broker), infere o **perfil do jogador**, cruza com uma **base de conhecimento do mundo do jogo** (wiki) e publica **recomendações human-readable** — por um motor de regras determinístico.

Para a aula, o jogo é **Super Mario World** (reconhecimento imediato da plateia, pré-requisitos reais e legíveis). A captura/análise de screenshot fica fora do escopo: a aula **começa nos eventos**, que são mockados por "playthroughs" (fitas de eventos que simulam sessões reais de jogo). A mensagem explícita na aula: *"amanhã você pluga o jogo que quiser na mesma interface"*.

## 4. Decisões registradas

| # | Decisão | Escolha | Motivo |
|---|---|---|---|
| 1 | Tese da aula | Mercado como gancho + SDD como método | Fecha o arco com a aula 1 |
| 2 | Divisão offline vs. gravação | Core pronto offline; gravação = 2 features via ciclo SDD completo | A gravação ensina o ciclo, não a digitação |
| 3 | Jogo da base de conhecimento | Super Mario World | Plateia conhece; gating por Switch Palaces/saídas secretas é didático; Sonic tem pré-requisito fraco |
| 4 | Camada de conhecimento | **Uma só**: wiki em formato OKF v0.2 (langchain-ai/openwiki), commitada no repo | Sem `graph.ts` paralelo: frontmatter = dado estruturado do motor; prosa = leitura rica; sem drift entre camadas |
| 5 | Autoria da wiki | OpenWiki + OpenCode (integração nativa) a partir de um detonado | Mesmo agente do curso; OKF portável; visualizador de grafo para slide |
| 7 | Perfis de jogador | `completionist`, `speedrunner`, `casual` | Vocabulário Mario; inferíveis a partir dos eventos (com timestamps) |
| 9 | Vocabulário | Eventos e componentes no domínio Mario (`level_started`, `boss_engaged`, power-ups) | Glossário registra; Avoid: "quest", "batalha" |
| 10 | Postura do operador | Responder de verdade na entrevista | Contraponto do protocolo da aula 1 |
| 11 | Terminal na gravação | Gravado separado, acelerado na edição | A entrevista ao vivo é o conteúdo; o terminal fica dinâmico |
| 12 | Branches | Numeradas, preservadas após merge, `main` sempre final | Alunos navegam a evolução; GitHub Pages não muda |

## 5. Non-goals (explícitos na aula e nas specs)

- ❌ Captura e análise de screenshot real (OCR/vision) — a aula começa nos eventos mockados.
- ❌ LLM no caminho determinístico — `PlayerProfiler` e `ProgressionAdvisor` são regras puras.
- ❌ UI/overlay — o sistema termina nas recomendações textuais no console.

## 6. Estágios, tickets e PRs

O desenvolvimento acontece em **10 estágios** (que organizam as issues) e em **tickets** (a unidade de trabalho). O projeto é **NestJS** com camadas **DDD** (`domain/` puro sem Nest · `application/` serviços · `infrastructure/` adapters · `presentation/` console). Cada **ticket** tem uma branch própria (`ticket/<issue>-<slug>`) e um **PR próprio** para a `main`, com `Closes #N` no corpo — o merge fecha o sub-issue correspondente. O merge acontece no fechamento do ticket (TDD/review verdes); branch **nunca é deletada**; a `main` recebe a evolução ticket a ticket — sempre verde, e o histórico conta a história do curso.

| # | Estágio (issue-pai) | Entregável | Quando | Tag |
|---|---|---|---|---|
| 01 | #1 `knowledge-base` | Wiki OpenWiki do SMW (OKF): schema + mundo + entidades | Offline, com apoio do agente | `v0.1` ✅ |
| 02 | issue do estágio | **Bootstrap NestJS + DDD**: tipos de evento + EventBus (`@nestjs/event-emitter`, in-memory síncrono) | Offline | `v0.2` |
| 03 | issue do estágio | `knowledge-loader`: OKF → `KnowledgeIndex` (fail fast) + fixtures | Offline | `v0.3` |
| 04 | issue do estágio | `PlayerProfiler` (3 perfis) + `ProgressionAdvisor` (services `@OnEvent`) | Offline | `v0.4` |
| 05 | issue do estágio | 3 fitas (JSON) + runner com `--speed` + console + `npm run demo` — **barramento in-memory** (sem broker, sem docker) | Offline | `v0.5` |
| 06 | issue do estágio | **Upgrade NestJS 11 → 12**: os `@nestjs/*` na v12 (ESM-only — nosso `type: module` ✓), o migration guide revisado (hook ordering, lifecycle), a suíte verde; a **observabilidade nativa** (`@nestjs/observe`) fica disponível para quando o projeto precisar | Offline | `v0.6` |
- O projeto é este repositório; **cada ticket = branch + PR** com `Closes #N`; o merge acontece no fechamento do ticket e as branches permanecem — os PRs merged, em ordem, são a evolução do curso.
- O estágio 06 é o **upgrade NestJS 12** (o migration guide revisado); os estágios seguintes são definidos ao vivo na aula.
- `@setup-matt-pocock-skills` na raiz ✅ antes da gravação (tracker **GitHub Issues**, labels de triagem, single-context).
- Os estágios seguintes são definidos ao vivo na aula.

## 7. Roteiro da gravação (resumo)

| Bloco | Tempo | Conteúdo |
|---|---|---|
| Abertura | 15' | Gancho GTA VI (19/11) + tendência TV + use case + non-goals |
| Tour do core | 10' | Arquitetura, base de conhecimento, demo dos 3 playthroughs |
| Encerramento | 5' | Recap, convite |

Detalhe completo (falas, telas, cortes): [PRESENTATION.md](./PRESENTATION.md).

## 8. Checklist de execução

O checklist vivo (o que está feito, o que falta) mora em **uma fonte só**: [`AGENTS.md`](./AGENTS.md) §Estado atual — consulte lá. Esta seção guardava a cópia e foi podada para não duplicar.

## 9. Referências

- **Fontes do jogo (etapa 01)**: [Detonado PC do Paulo](https://www.pcdopaulo.com/2024/09/detonado-super-nintendo-super-mario.html) · [Super Mario Wiki — Secret exit](https://www.mariowiki.com/Secret_exit) · [SM Wiki — Super Mario World](https://www.mariowiki.com/Super_Mario_World) · [YouTube — Saídas Secretas](https://www.youtube.com/watch?v=KjhSUdv5Lwo)

- [Matt Pocock Skills](https://github.com/mattpocock/skills) · [OpenCode](https://opencode.ai/docs)
- [langchain-ai/openwiki](https://github.com/langchain-ai/openwiki) · [Open Knowledge Format (OKF) v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [cleanyour.tv](https://cleanyour.tv/) · [Rockstar — GTA VI 19/11/2026](https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026)
- Aula 1: [README do curso](https://github.com/thpoiani/dio-spec-driven-development) · [slides](https://github.com/thpoiani/dio-spec-driven-development/tree/main/slides)
