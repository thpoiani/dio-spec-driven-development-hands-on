---
title: "Mundo de Super Mario World: esqueleto curado e momento da demo"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T17:26:03.041Z
sources:
  - id: openwiki-source-362e06c30ccfdafd87339cb0
    resource: repo://ARCHITECTURE.md
generated: { by: "opencode", at: "2026-11-16T17:26:03.041Z" }
---

# Mundo de Super Mario World: esqueleto curado e momento da demo

O mundo é um esqueleto curado do jogo real, simplificado para caber em aula: 5 áreas principais + a camada secreta (Star Road → Special Zone). A escolha do SMW é didática: o **gating** é real e legível — Switch Palaces que desbloqueiam caminhos, keyholes que abrem fases secretas, bosses que liberam mundos.

## Fontes

- **Ingestão primária**: detonado **PC do Paulo** (PT-BR, texto completo, com saídas secretas e Star World detalhados).
- **Validação canônica**: **Super Mario Wiki** (página *Secret exit* — as 24 saídas secretas e o gating exato).

## Áreas e gating

| Área | Conteúdo | Papel no gating |
|---|---|---|
| **Yoshi's Island** (hub) | Fases 1–4, Yoshi's House, **Iggy's Castle** | Tutorial; boss libera Donut Plains |
| **Donut Plains** | Fases 1–4, **Green Switch Palace**, Donut Secret 1 (keyhole → **Star Road**), **Ludwig's Castle** | Switch Palace desbloqueia blocos "!" nos mundos seguintes; boss libera Forest of Illusion |
| **Forest of Illusion** | Fases com **múltiplas saídas** (labirinto), Forest Switch Palace, **Roy's Castle** | O momento da demo |
| **Chocolate Island** | Fases, Chocolate Secret, **Wendy's Castle** | Boss libera o acesso ao Valley of Bowser |
| **Valley of Bowser** | Fases 1–4, **Larry's Castle** (final) | Fim do caminho principal |
| **Star Road → Special Zone** | Acesso só por secret exits/keyholes; 8 níveis especiais | Conteúdo do completionist; **homework** |

## Power-ups como equipamento

**Cape Feather** (voo — ideal para castelos), **Fire Flower** e **Yoshi**: os advisors sugerem qual levar quando o jogador enfrenta um `boss_engaged` sem o item recomendado.

## O momento da demo

O jogador **casual** entra na Forest of Illusion e **entra em loop**: a saída normal da Forest of Illusion 4 não progride para o próximo mundo. O `ProgressionAdvisor` cruza o índice com o estado do jogador e aponta a saída secreta; o `WorldAdvisor` enriquece com a prosa da wiki (onde fica a keyhole, qual power-up levar). Duas saídas para o mesmo evento — regra e agente — porque o contrato do evento está na spec.

## As 3 fitas de demo

| Fita | Roteiro | Resultado esperado |
|---|---|---|
| `casual.ts` | Caminho principal, sem segredos, inventário frequente, pausas longas | Perfil `casual`; loop na Forest of Illusion → dica de gating + enriquecimento do agente |
| `completionist.ts` | Secret exits, Switch Palaces, Dragon Coins, coleta constante | Perfil `completionist`; o que falta coletar por área; caminho para a Star Road |
| `speedrunner.ts` | Deltas curtos, direto aos castelos, zero desvios | Perfil `speedrunner`; próximo objetivo e rota otimizada |
