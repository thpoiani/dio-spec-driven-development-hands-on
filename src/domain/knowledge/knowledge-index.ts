// O token de DI do índice de conhecimento (infrastructure fornece, domain consulta).
export const KNOWLEDGE_INDEX = Symbol("KnowledgeIndex");

// O índice em memória do mundo — o que o motor de regras consulta.
// Imutável e consultado sem I/O: as regras de progressão são puras sobre ele.

export interface KnowledgeArea {
  id: string;
  name: string;
  order: number;
  unlocks: string[];
}

export type ExitKind = "normal" | "secret" | "keyhole";

export interface KnowledgeExit {
  kind: ExitKind;
  goesTo: string;
  requirement?: string;
}

export interface KnowledgeLevel {
  id: string;
  name: string;
  area: string;
  kind: "main" | "side";
  exits: KnowledgeExit[];
  prerequisites: string[];
  rewards: string[];
  boss: boolean;
}

export interface KnowledgeSwitchPalace {
  id: string;
  name: string;
  unlocks: string[];
}

export interface KnowledgePowerUp {
  id: string;
  name: string;
  effect: string;
  recommendedFor: string[];
}

export interface KnowledgeBoss {
  id: string;
  name: string;
  castle: string;
  defeatedUnlocks: string[];
}

export interface KnowledgeIndex {
  game: string;
  areas: KnowledgeArea[];
  levels: KnowledgeLevel[];
  switchPalaces: KnowledgeSwitchPalace[];
  powerUps: KnowledgePowerUp[];
  bosses: KnowledgeBoss[];
}

export function levelsByArea(
  index: KnowledgeIndex,
  area: string,
): KnowledgeLevel[] {
  return index.levels.filter((level) => level.area === area);
}

export function levelById(
  index: KnowledgeIndex,
  id: string,
): KnowledgeLevel | undefined {
  return index.levels.find((level) => level.id === id);
}

export function areasInOrder(index: KnowledgeIndex): KnowledgeArea[] {
  return [...index.areas].sort((a, b) => a.order - b.order);
}
