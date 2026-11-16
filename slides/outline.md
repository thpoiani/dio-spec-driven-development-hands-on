# Outline · Spec-Driven Development: da spec ao produto

> Rascunho para aprovação. **Não gere o `index.html` antes do ok.**
> Uma linha por slide. O título aqui é o título que vai para o slide.

## Metadados

Estes valores vão direto para o bloco `DECK` do template.

| Campo | Valor |
|---|---|
| `title` | Spec-Driven Development: da spec ao produto |
| `subtitle` | construindo um Game Copilot de verdade — feature, arquitetura e agentes sob o mesmo contrato |
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
00:15  O sistema: Game Copilot + demo            (slides 09–12 · 10 min)
00:25  SDD para infraestrutura                   (slides 13–16 · 15 min)
00:40  SDD para agentes                          (slides 17–19 · 20 min)
01:00  Recap, homework e convite                 (slides 20–23 · 5 min)
```

> Ancorado nos marcadores visíveis: o contador do rodapé (`NN / 23`) e os números das Partes nos divisores (slides 04, 09, 13 e 17).

Mapeamento para gravação (pelo contador do rodapé): Abertura = 04–08 · O sistema = 09–12 · Infraestrutura = 13–16 · Agentes = 17–19 · Encerramento = 20–23.

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
**Título:** SDD na prática: construindo um Game Copilot
**Mensagem:** o ciclo spec-driven aplicado a um sistema real — do evento de gameplay à recomendação no console
**Nota:** abrir com a promessa: você vai ver um sistema de verdade evoluir por spec — não um TODO app

### 02 · agenda
**Título:** O que a gente vai ver
**Mensagem:** o problema de mercado · o sistema rodando · infraestrutura por spec · agentes por spec · homework
**Nota:** 15 + 10 + 15 + 20 + 5 minutos

### 03 · bio
**Título:** Thiago Poiani
**Mensagem:** Principal Software Engineer @ Skip · foto: avatar do GitHub (github.com/thpoiani.png, link externo) · SDD na prática: o repositório do Game Copilot é a aula
**Nota:** duas linhas bastam; criar confiança, não currículo

### 04 · divisor
**Título:** A semana em que o jogo lançou
**Mensagem:** o jogador não pode pausar para buscar estratégia — e nenhum detonado cobre tudo
**Nota:** tendência de mercado como gancho, use case como resposta

### 05 · bullets
**Título:** GTA VI: o lançamento da década
**Mensagem:** 19/11/2026 — audiência massiva; o jogador busca estratégia sem sair do jogo
**Nota:** "na semana em que esta aula sai, o jogo mais esperado da década está nas mãos de milhões de jogadores"

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
**Mensagem:** um sistema de verdade rodando antes de qualquer evolução — o brownfield onde o SDD brilha
**Nota:** mostrar o sistema existente: wiki, barramento, profiler, advisor

### 10 · diagrama
**Título:** Um contrato, consumidores independentes
**Mensagem:** telemetria → barramento de eventos → profiler + advisor → recomendações no console
**Nota:** a base de conhecimento é a wiki OpenWiki/OKF gerada de um detonado de Super Mario World

### 11 · duas-colunas
**Título:** A base de conhecimento também tem spec
**Mensagem:** frontmatter alimenta o motor · prosa é leitura rica · schema é a spec da base
**Nota:** frase-tese do bloco — mostrar o grafo da wiki no visualizador

### 12 · terminal
**Título:** Demo: três jogadores, três perfis
**Mensagem:** `npm run demo` — o casual trava no loop da Forest of Illusion e o advisor aponta a saída secreta
**Nota:** rodar em tempo real; se falhar, cortar para a fita acelerada

### 13 · divisor
**Título:** SDD para infraestrutura
**Mensagem:** a evolução de arquitetura também começa na spec — feature nova não é o único gatilho
**Nota:** o ciclo é o mesmo; o que a spec precisa fixar muda

### 14 · citacao
**Título:** A iniciativa
**Mensagem:** "quero que os eventos do jogo passem por um barramento de verdade, não por uma fila em memória"
**Nota:** vaga de propósito — o grill transforma em decisões, não em suposições

### 15 · bullets
**Título:** O que a entrevista tira da vaga
**Mensagem:** a interface `EventBus` é a seam · os consumidores não mudam · sem persistência (non-goal) · o glossário ganha os termos de infra
**Nota:** artefatos na tela: spec, tickets com dependências, glossário recebendo os termos

### 16 · terminal
**Título:** A mesma execução, o transporte trocado
**Mensagem:** TDD + code-review acelerados; a suíte verde prova que nenhum consumidor quebrou
**Nota:** a seam na prática — o contrato sobrevive à troca

### 17 · divisor
**Título:** SDD para agentes
**Mensagem:** comportamento não-determinístico também entra no contrato — o que um agente exige da spec
**Nota:** o bloco mais rico: a spec de um LLM fixa quando, o quê e o que nunca fazer

### 18 · bullets
**Título:** O que a spec fixa num agente
**Mensagem:** quando reage (eventos relevantes + throttle) · contrato de saída com `evidence` · guardrail: sem evidência, não publica · provider é decisão de spec
**Nota:** "não invente segredo que não está na wiki"

### 19 · terminal
**Título:** Dois consumidores, um contrato
**Mensagem:** o console mostra regras e agente no mesmo barramento — a spec definiu o evento
**Nota:** a demo que fecha a aula

### 20 · exercicio
**Título:** Homework: expanda o mundo
**Mensagem:** expanda a base de conhecimento na wiki e rode o ciclo completo sozinho — spec e tickets publicados no repositório
**Nota:** critério de sucesso: PR com a wiki expandida passando no `check:wiki`

### 21 · recap
**Título:** Cinco coisas para levar
**Mensagem:** a spec é o contrato que sobrevive à sessão · o que você não diz, o agente inventa · SDD serve para feature, arquitetura e agente · a base de conhecimento também tem spec · o método transforma decisões em requisitos testáveis
**Nota:** a versão que a pessoa repete no elevador

### 22 · referencias
**Título:** Onde continuar
**Mensagem:** OpenWiki (docs.langchain.com/oss/openwiki) · LangChain (docs.langchain.com/oss/python/langchain) · NestJS (docs.nestjs.com) · OpenCode (opencode.ai) · Skills do Matt Pocock (github.com/mattpocock/skills)
**Nota:** os cinco links vivem no `DECK.links` e voltam no encerramento

### 23 · encerramento
**Título:** Dúvidas?
**Mensagem:** transforme o próximo prompt vago em spec — escolha a ferramenta (Spec Kit, OpenSpec, Skills) e comece
**Nota:** nunca termine com "era isso, obrigado"
