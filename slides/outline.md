# Outline · Spec-Driven Development: da spec ao produto

> Rascunho para aprovação. **Não gere o `index.html` antes do ok.**
> Uma linha por slide. O título aqui é o título que vai para o slide.

## Metadados

Estes valores vão direto para o bloco `DECK` do template.

| Campo | Valor |
|---|---|
| `title` | Spec-Driven Development: da spec ao produto |
| `subtitle` | construindo um Game Copilot — feature, arquitetura e agentes sob o mesmo contrato |
| `event` | Spec-Driven Development (título do curso — o cabeçalho mostra título + data) |
| `date` | Novembro 2026 |
| `instructor.name` | Thiago Poiani |
| `instructor.role` | Principal Software Engineer, Skip |
| `theme` | dark |
| Duração | 65 minutos |
| `links` | docs.langchain.com/oss/openwiki · docs.langchain.com/oss/python/langchain · docs.nestjs.com · opencode.ai · github.com/mattpocock/skills |

## Roteiro

```text
00:00  Abertura: a semana em que o jogo lançou   (slides 04–08 · 15 min)
00:15  O sistema: Game Copilot + demo            (slides 09–13 · 10 min)
00:25  Hands-on: o desenvolvimento ao vivo       (slide 14 · ~35 min)
01:00  Homework, recap e convite                 (slides 15–18 · 5 min)
```

> Ancorado nos marcadores visíveis: o contador do rodapé (`NN / 18`) e os números das Partes nos divisores (slides 04, 09 e 14).

Mapeamento para gravação (pelo contador do rodapé): Abertura = 04–08 · O sistema = 09–13 · Hands-on = 14 (retorno: 15) · Encerramento = 15–18.

## Slides

Formato:

```markdown
### 05 · bullets
**Título:** O que um agente de código faz
**Mensagem:** ele lê, executa, edita e devolve um diff — não adivinha
**Nota:** pergunte quem já viu um agente apagar arquivo antes de explicar permissões
```

Layouts disponíveis: `capa`, `agenda`, `bio`, `divisor`, `bullets`, `duas-colunas`, `diagrama`, `codigo`, `terminal`, `numeros`, `citacao`, `exercicio`, `recap`, `referencias`, `encerramento`.

---

### 01 · capa
**Título:** Spec-Driven Development: da spec ao produto
**Mensagem:** construindo um Game Copilot — feature, arquitetura e agentes sob o mesmo contrato
**Nota:** abrir com a promessa: você vai ver um sistema de verdade evoluir por spec — não um TODO app

### 02 · bio
**Título:** Thiago Poiani
**Mensagem:** Principal Software Engineer @ Skip · foto: avatar do GitHub (github.com/thpoiani.png, link externo) · @thpoiani no LinkedIn e redes
**Nota:** duas linhas bastam; criar confiança, não currículo

### 03 · agenda
**Título:** O que a gente vai ver
**Mensagem:** o problema de mercado · o sistema rodando · hands-on ao vivo · homework · recap e convite
**Nota:** 15 + 10 + ~35 (ao vivo) + 5 minutos

### 04 · divisor
**Título:** A semana em que o jogo lançou
**Mensagem:** o jogador não pode pausar para buscar estratégia — e nenhum detonado cobre tudo
**Nota:** tendência de mercado como gancho, use case como resposta

### 05 · bullets
**Título:** GTA VI: o lançamento da década
**Mensagem:** 19/11/2026 — audiência massiva; o jogador busca estratégia sem sair do jogo
**Nota:** logo oficial do GTA VI no slide (newswire da Rockstar, link externo) · "na semana em que esta aula sai, o jogo mais esperado da década está nas mãos de milhões de jogadores"

### 06 · duas-colunas
**Título:** A TV virou plataforma computacional
**Mensagem:** de um lado, sistemas que travam a TV; do outro, sistemas abertos (cleanyour.tv) — um assistente de gameplay é produto, não hack
**Nota:** se a TV é aberta, o copiloto de jogo é a próxima categoria

### 07 · diagrama
**Título:** O use case: telemetria → perfil → recomendação
**Mensagem:** eventos de gameplay → perfil do jogador → base de conhecimento → dicas no console
**Nota:** corte didático: começamos na telemetria; "amanhã você pluga o jogo que quiser na mesma interface"

### 08 · bullets
**Título:** O que fica fora
**Mensagem:** sem captura de screenshot (OCR/vision) · sem LLM no caminho determinístico · sem UI — o sistema termina no console
**Nota:** non-goals explícitos: o que a spec não diz, o agente inventa

### 09 · divisor
**Título:** O sistema: Game Copilot
**Mensagem:** um sistema rodando antes de qualquer evolução — o brownfield onde o SDD brilha
**Nota:** mostrar o sistema existente: wiki, barramento, profiler, advisor

### 10 · duas-colunas (big picture)
**Título:** O sistema completo, ponta a ponta
**Mensagem:** clientes (PS5 · PC · Xbox · Switch 2) → captura (OCR/vision) → Game Copilot (barramento + regras + agente LLM + wiki) → notificação com a recomendação ("FoI 4 não progride — busque a keyhole")
**Nota:** width 100% — todos os componentes, mesmo os fora do escopo agora; badges hoje/ao vivo/visão marcam o que existe e o que vem

### 11 · diagrama
**Título:** Um contrato, consumidores independentes
**Mensagem:** telemetria → barramento de eventos → profiler + advisor → recomendações no console
**Nota:** a interface EventBus é a seam: trocar o transporte não toca nos consumidores

### 12 · duas-colunas
**Título:** A base de conhecimento também tem spec
**Mensagem:** frontmatter alimenta o motor · prosa é leitura rica · schema é a spec da base
**Nota:** a wiki nasceu de um detonado de Super Mario World; o grafo do openwiki visualize mostra as conexões

### 13 · terminal
**Título:** Demo: três jogadores, três perfis
**Mensagem:** `npm run demo` — o casual trava no loop da Forest of Illusion e o advisor aponta a saída secreta
**Nota:** rodar em tempo real; se falhar, cortar para a fita acelerada

### 14 · divisor
**Título:** Hands-on
**Mensagem:** a partir daqui eu assumo o teclado — e o desenvolvimento começa ao vivo, pelo ciclo SDD
**Nota:** do slide em diante é gravação ao vivo: grill, spec, tickets e implement com TDD — o retorno ao deck acontece no homework

### 15 · exercicio
**Título:** Adicione um novo jogo
**Mensagem:** o copiloto hoje só conhece Super Mario World — especifique o que muda (eventos, perfis, wiki por jogo), projete com design patterns e rode o ciclo SDD completo
**Nota:** critério de sucesso: o mesmo copiloto recomenda para dois jogos, sem duplicar o motor (a wiki já é organizada por jogo: openwiki/<game-slug>/)

### 16 · recap
**Título:** Cinco coisas para levar
**Mensagem:** a spec é o contrato que sobrevive à sessão · o que você não diz, o agente inventa · SDD serve para feature, arquitetura e agente · a base de conhecimento também tem spec · o método transforma decisões em requisitos testáveis
**Nota:** a versão que a pessoa repete no elevador

### 17 · referencias
**Título:** Onde continuar
**Mensagem:** OpenWiki · LangChain · NestJS · OpenCode · Skills do Matt Pocock
**Nota:** os cinco links vivem no `DECK.links` e voltam no encerramento

### 18 · encerramento
**Título:** Obrigado!
**Mensagem:** slide simples de agradecimento (logo DIO + evento no rodapé)
**Nota:** agradecimento simples; as perguntas seguem na conversa

---

## Antes de mandar para aprovação

- [x] Todo título é uma afirmação, com no máximo ~60 caracteres (exceção: a capa).
- [x] Nenhum slide tem duas ideias.
- [x] Nenhum layout aparece duas vezes seguidas.
- [x] Existe um divisor por bloco (3 no total — a Parte 03 é o hands-on ao vivo).
- [x] Tem agenda, recap e agradecimento (exercício = o homework).
- [x] O tempo do roteiro fecha com a duração da aula (65 min, ~35 de desenvolvimento ao vivo).
- [x] Imagens (avatar do GitHub e logo do GTA VI) carregadas por link externo — nenhuma no git.
