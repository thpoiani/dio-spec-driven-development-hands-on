---
title: "Valley of Bowser 4"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T18:09:34.647Z
sources:
  - id: openwiki-source-653c703774f368e1bb4f62f3
    resource: repo://knowledge/sources/detonado-pc-do-paulo-secret-exits.md
  - id: openwiki-source-cd6ecaff50c667d50b2ebcc0
    resource: repo://knowledge/sources/super-mario-wiki-progress.md
generated: { by: "opencode", at: "2026-11-16T18:09:34.647Z" }
---

# Valley of Bowser 4

Última fase regular antes do **Larry's Castle** — com uma **saída secreta dupla**: leva à **Front Door** do castelo de Bowser **e** à **Star World 5**.

## Saídas

- **Normal**: → Larry's Castle.
- **Secret exit** → **Front Door + Star World 5**: atalho para o confronto final e para a camada secreta.


## Conexões

- **Área**: [Valley of Bowser](../areas/valley-of-bowser.md)
- **Saída normal**: [Larry's Castle](larrys-castle.md)
- **Secret exit**: valley-of-bowser-front-door
- **Secret exit**: star-world-5
- **Pré-requisito**: [Valley of Bowser 3](valley-of-bowser-3.md)

## Dados

```yaml
type: level
id: valley-of-bowser-4
name: Valley of Bowser 4
area: valley-of-bowser
kind: main
exits:
  - kind: normal
    goes-to: larrys-castle
  - kind: secret
    goes-to: valley-of-bowser-front-door
  - kind: secret
    goes-to: star-world-5
prerequisites: [valley-of-bowser-3]
rewards: []
boss: false
```
