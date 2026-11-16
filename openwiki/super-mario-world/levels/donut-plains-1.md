---
title: "Donut Plains 1"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T18:09:34.647Z
sources:
  - id: openwiki-source-653c703774f368e1bb4f62f3
    resource: repo://knowledge/sources/detonado-pc-do-paulo-secret-exits.md
generated: { by: "opencode", at: "2026-11-16T18:09:34.647Z" }
---

# Donut Plains 1

Primeira fase de **Donut Plains**. Sua saída secreta leva à **Donut Secret 1** (que leva à Donut Secret House — a porta da Star Road).

## Saídas

- **Normal**: segue para a Donut Plains 2.
- **Secret exit** → **Donut Secret 1**: com o Green Switch Palace ativado, a keyhole está no topo da pilha de blocos "!" verdes perto do final (correr com Y para subir). Sem o botão verde: passe pelos 4 Koopa Paratroopas em fileira, corra e voe (de Cape) sobre o túnel amarelo onde está a chave.


## Conexões

- **Área**: [Donut Plains](../areas/donut-plains.md)
- **Saída normal**: [Donut Plains 2](donut-plains-2.md)
- **Secret exit**: donut-secret-1
- **Pré-requisito**: [Iggy's Castle](iggys-castle.md)

## Dados

```yaml
type: level
id: donut-plains-1
name: Donut Plains 1
area: donut-plains
kind: main
exits:
  - kind: normal
    goes-to: donut-plains-2
  - kind: secret
    goes-to: donut-secret-1
prerequisites: [iggys-castle]
rewards: []
boss: false
```
