---
title: "Forest of Illusion 2"
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

# Forest of Illusion 2

Nível aquático da **Forest of Illusion** — sua saída secreta ativa o **Blue Switch Palace**, os blocos "!" azuis que abrem atalhos no restante do mundo.

## Saídas

- **Normal**: segue o curso submerso da floresta.
- **Secret exit** → **Blue Switch Palace**: ao chegar ao bloco "!" amarelo, fique no fundo e nade para a esquerda, direto para a parede — há um compartimento secreto na água.

## Dados

```yaml
type: level
id: forest-of-illusion-2
name: Forest of Illusion 2
area: forest-of-illusion
kind: main
exits:
  - kind: normal
    goes-to: forest-of-illusion-3
  - kind: secret
    goes-to: blue-switch-palace
prerequisites: [forest-of-illusion-1]
rewards: []
boss: false
```

## Estratégia

O Blue Switch Palace é o que abre os blocos "!" azuis — sem ele, trechos de Vanilla Dome e da Forest of Illusion ficam inacessíveis. É um dos dois palácios declarados no esqueleto curado do mundo.
