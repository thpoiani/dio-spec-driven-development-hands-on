# CODING_STANDARDS

Regras aplicadas na **revisão** (não na implementação). Cada regra aqui é um julgamento que nenhum guardrail automático substitui — o resto é mecanismo e mora no CI (`.github/workflows/ci.yml`) e no `npm run check:wiki`.

## Conhecimento do jogo (wiki OpenWiki)

1. **Provenance obrigatória**: toda afirmação material de uma página da wiki leva Claim com evidência (`repo://...` ou `sources` do detonado/fonte). Dica ou fato sem fonte não entra.
2. **Fatos validados contra a fonte canônica**: o gating e a progressão citam a Super Mario Wiki (página *Secret exit* e páginas por nível) — o detonado PC do Paulo é a fonte de ingestão, a SM Wiki é a régua. Divergência = conferir antes de publicar.
3. **Vocabulário**: o domínio é o do jogo — *Avoid* "quest" e "batalha" (são `level`, `boss_engaged`), "grafo tipado" (a wiki é a única camada). Os nomes de perfis (`casual`, `completionist`, `speedrunner`) e eventos (`area_entered`, `level_started`, `level_completed`, `inventory_opened`, `boss_engaged`) são canônicos.
4. **A wiki contém apenas conhecimento de jogo** — arquitetura, processo e decisões vivem em `SCOPE.md`, `ARCHITECTURE.md` e `AGENTS.md`.

## Esquema da wiki

5. **Todo nível de gating declara `exits` e `prerequisites` completos no frontmatter/bloco de dados** — o ProgressionAdvisor não "adivinha" caminho; o que não está declarado não é recomendado.
6. **Estado do jogo em páginas novas**: fases com secret exit entram com o dado estruturado (bloco `yaml`/frontmatter completo) e prosa — nunca só prosa.

## Código (a partir da etapa 02)

7. **Funções puras nos consumidores determinísticos** (`PlayerProfiler`, `ProgressionAdvisor`): sem estado global, sem I/O — a entrada sai do `EventBus`, o resultado volta como evento.
8. **Vocabulário do glossário vincula identificadores**: o `GLOSSARY.md` (criado pelo `/domain-modeling`) é o padrão de nomenclatura para código, teste e revisão.
9. **`@Inject` explícito nos construtores Nest**: o vitest/esbuild não emite metadados de decorator — o DI por tipo falha silenciosamente nos testes; declare o token sempre que a dependência vier de outro módulo.
