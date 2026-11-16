# Setup do OpenWiki (etapa 01) — guia passo a passo

> Como a base de conhecimento do Game Copilot nasceu: o **OpenWiki** transforma fontes do repositório em uma wiki viva em formato **OKF v0.2** — páginas markdown com frontmatter estruturado (o que o motor de regras consome), prosa com evidência (o que o agente lê) e **Claims** rastreando a fonte de cada afirmação.
> Base do padrão: [llm-wiki.md do Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), implementado em [langchain-ai/openwiki](https://github.com/langchain-ai/openwiki).

## 1. Instalação

```bash
npm install -g openwiki
```

Requer Node.js 22.22+.

## 2. Integração com o agente (OpenCode)

```bash
openwiki integrations install opencode
```

Registra as ferramentas MCP na sessão do OpenCode:

- **Escrita (ciclo de vida)**: `openwiki_begin` → `openwiki_submit_plan` → `openwiki_next_page`/`openwiki_submit_page` (repetido por página) → `openwiki_finish`
- **Leitura (retrieval, sem chamada de modelo)**: `openwiki_search` e `openwiki_read`

## 3. Inicialização

Peça ao agente, dentro do repositório:

> "Initialize this repository's OpenWiki from the current source and tests."

O agente executa o ciclo: `begin` (planejamento) → plano de páginas canônicas → uma página por vez, cada afirmação material virando um **Claim com evidência** (`repo://caminho#Llinhas`) → `finish` (validação, índice, provenance). O resultado é commitado em `openwiki/`.

## 4. O que foi gerado neste projeto

```text
openwiki/
├── INSTRUCTIONS.md        # o brief (nossa spec da base): idioma, vocabulário, prioridades
├── quickstart.md          # ponto de entrada: mapa das páginas e como usar retrieval
├── overview.md            # o projeto das duas aulas, tese e non-goals
├── hands-on/contracts.md  # componentes e contratos (EventBus, perfis, recomendações)
├── hands-on/stages.md     # os 10 estágios, branches empilhadas e tracker
├── knowledge/schema.md    # o schema OKF da base (tipos de página e campos obrigatórios)
├── knowledge/world-map.md # o mundo de SMW curado e o momento da demo
├── index.md, */index.md   # índices por seção
├── .claims/               # evidência versionada de cada Claim (OpenWiki-owned)
├── .page-manifest.json    # estado das páginas (OpenWiki-owned)
└── .last-update.json      # marcador da última run (OpenWiki-owned)
```

Também entra o bloco `OPENWIKI:START/END` no `AGENTS.md` da raiz (gerido — instruções de retrieval para agentes) e `.github/workflows/openwiki-update.yml` (atualização agendada; requer provider configurado para rodar).

## 5. Customização: o brief é a spec

O `openwiki/INSTRUCTIONS.md` é **escrito por nós** e lido pelo OpenWiki em toda geração: define o foco (Game Copilot), o idioma (pt-BR), o vocabulário obrigatório (perfis, eventos, componentes — *Avoid* "quest"/"batalha") e os non-goals. **O schema da base é o schema da wiki** — mudança de campo passa pelo `knowledge-loader` (etapa 03).

## 6. Visualização

```bash
openwiki visualize
```

Grafo interativo das páginas com leitor markdown lado a lado (export estático: `openwiki visualize openwiki --export <dir>`) — o material do slide "a base de conhecimento do jogo".

## 7. Manutenção

- Depois de mudanças no código/docs, peça a atualização: o OpenWiki compara a fonte com as evidências dos Claims e só regenera o que ficou obsoleto (run limpa = no-op).
- **Nunca edite páginas geradas à mão** — atualize a fonte e regenere. As próximas páginas do mundo (áreas, níveis, power-ups, bosses — tickets #3–#7) entram como update run quando o digest do detonado estiver no repositório.

## 8. Fontes do mundo

- **Ingestão primária**: [Detonado Super Mario World — PC do Paulo](https://www.pcdopaulo.com/2024/09/detonado-super-nintendo-super-mario.html) (PT-BR).
- **Validação canônica**: [Super Mario Wiki — Secret exit](https://www.mariowiki.com/Secret_exit) (gating canônico das 24 saídas secretas).
