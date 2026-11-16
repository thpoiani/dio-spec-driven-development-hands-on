---
title: "Super Mario World — mundo curado e gating"
type: "Referência"
openwiki_generated: true
verified:
  - by: openwiki/0.9.0
    at: 2026-11-16T19:04:45.295Z
sources:
  - id: openwiki-source-362e06c30ccfdafd87339cb0
    resource: repo://ARCHITECTURE.md
  - id: openwiki-source-653c703774f368e1bb4f62f3
    resource: repo://knowledge/sources/detonado-pc-do-paulo-secret-exits.md
  - id: openwiki-source-cd6ecaff50c667d50b2ebcc0
    resource: repo://knowledge/sources/super-mario-wiki-progress.md
generated: { by: "opencode", at: "2026-11-16T18:09:34.647Z" }
---

# Super Mario World — mundo curado e gating

O esqueleto curado do mundo, simplificado para a base de conhecimento: 5 áreas principais + a camada secreta (Star Road → Special Zone). O gating é real e legível — Switch Palaces desbloqueiam caminhos, keyholes abrem fases secretas, bosses liberam mundos.

## Fontes

- **Ingestão primária**: detonado **PC do Paulo** (PT-BR, texto completo, com saídas secretas e Star World detalhados) — <https://www.pcdopaulo.com/2024/09/detonado-super-nintendo-super-mario.html>
- **Validação canônica**: **Super Mario Wiki** (página *Secret exit* — as 24 saídas secretas do jogo e o gating exato) — <https://www.mariowiki.com/Secret_exit>
- **Referência visual**: YouTube — *Todas as Saídas Secretas* — <https://www.youtube.com/watch?v=KjhSUdv5Lwo>

## Áreas e gating

| Área | Conteúdo | Papel no gating |
|---|---|---|
| **Yoshi's Island** (hub) | Fases 1–4, Yoshi's House, **Iggy's Castle** | Tutorial; boss libera Donut Plains |
| **Donut Plains** | Fases 1–4, **Green Switch Palace**, Donut Secret 1 (keyhole → **Star Road**), **Ludwig's Castle** | Switch Palace desbloqueia blocos "!" nos mundos seguintes; boss libera Forest of Illusion |
| **Forest of Illusion** | Fases com **múltiplas saídas** (labirinto: sem a saída secreta certa, repete-se a área), **Blue Switch Palace**, **Roy's Castle** | A saída normal da Forest of Illusion 4 não progride — o progresso exige a saída secreta |
| **Chocolate Island** | Fases, Chocolate Secret, **Wendy's Castle** | Boss libera o acesso ao Valley of Bowser |
| **Valley of Bowser** | Fases 1–4, **Larry's Castle** (final) | Fim do caminho principal |
| **Star Road → Special Zone** | Acesso só por **secret exits/keyholes**; 8 níveis especiais | Conteúdo do completionist (100% de saídas) |

Fato canônico (Super Mario Wiki): completar o jogo exige **no mínimo duas saídas secretas**, e das 96 saídas totais, 24 são secretas — todas necessárias para 100%.

## Power-ups

**Cape Feather** (voo — ideal para castelos), **Fire Flower** (projéteis) e **Yoshi** (montaria e alcance extra): cada um tem contexto de uso recomendado e aparece como recompensa (`rewards`) de fases específicas.

## Segredos de gating (as chaves do mundo)

- `Donut Plains 2` → **Green Switch Palace** (blocos "!" de Donut Plains e adiante)
- `Forest of Illusion 2` → **Blue Switch Palace**
- `Forest of Illusion 4` → **Forest Secret Area** (única forma de sair da floresta)
- `Donut Secret House` → **Star World 1**
- `Valley Ghost House` → **Larry's Castle** (entrada secreta do castelo final)

Essas setas de progresso são exatamente o que o frontmatter (`exits`/`prerequisites`) declara — a estratégia do jogo mora nos secret exits.
