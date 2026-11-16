---
title: "Forest of Illusion 4"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T18:04:15.378Z
sources:
  - id: openwiki-source-653c703774f368e1bb4f62f3
    resource: repo://knowledge/sources/detonado-pc-do-paulo-secret-exits.md
generated: { by: "opencode", at: "2026-11-16T18:04:15.378Z" }
---

# Forest of Illusion 4

O nível do **momento de gating mais famoso da Forest of Illusion**: a saída **normal** não progride — leva de volta a um ponto já desbloqueado do mapa. Quem entra aqui sem saber, repete a área. A única forma de sair da floresta é a **saída secreta**: a keyhole no túnel azul flutuante com Lakitu, que leva à **Forest Secret Area**.

## Saídas

- **Normal**: leva de volta a um ponto já desbloqueado — **não progride** (canônico: Super Mario Wiki).
- **Secret exit** (keyhole) → **Forest Secret Area**: entre no túnel azul flutuante que tem Lakitu nele — a keyhole está lá dentro. Chegar ao topo sem voar é difícil, mas possível; com a Cape, é mais fácil.


## Conexões

- **Área**: [Forest of Illusion](../areas/forest-of-illusion.md)
- **Saída normal**: não progride — leva de volta à própria fase
- **Secret exit**: forest-secret-area
- **Pré-requisito**: [Forest of Illusion 3](forest-of-illusion-3.md)

## Dados

```yaml
type: level
id: forest-of-illusion-4
name: Forest of Illusion 4
area: forest-of-illusion
kind: main
exits:
  - kind: normal
    goes-to: forest-of-illusion-4
  - kind: secret
    goes-to: forest-secret-area
prerequisites: [forest-of-illusion-3]
rewards: []
boss: false
```

A saída normal leva de volta à própria área (loop canônico) — sem o secret, a floresta não abre.

## Estratégia

É aqui que o assistente mostra o valor: o jogador casual repete o loop, e o ProgressionAdvisor — lendo `exits` e `prerequisites` desta página — aponta que a saída é o **secret exit com keyhole**. Com a Cape (ver `power-up` **Cape Feather**) o túnel do Lakitu fica trivial.
