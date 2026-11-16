// Tipos canônicos de telemetria do jogo — a linguagem do glossário vivendo no código.
// Vocabulário: Super Mario World — *Avoid* "quest" e "batalha" (são level e boss_engaged).

export const GAME_TOPIC = {
  areaEntered: "game/telemetry/area_entered",
  levelStarted: "game/telemetry/level_started",
  levelCompleted: "game/telemetry/level_completed",
  inventoryOpened: "game/telemetry/inventory_opened",
  bossEngaged: "game/telemetry/boss_engaged",
} as const;

export type GameTopic = (typeof GAME_TOPIC)[keyof typeof GAME_TOPIC];

export type AreaId =
  | "yoshis-island"
  | "donut-plains"
  | "forest-of-illusion"
  | "chocolate-island"
  | "valley-of-bowser"
  | "star-road";

export type ExitKind = "normal" | "secret" | "keyhole";

export interface AreaEntered {
  area: AreaId;
}

export interface LevelStarted {
  level: string;
}

export interface LevelCompleted {
  level: string;
  exit: ExitKind;
  durationMs: number;
}

export interface InventoryOpened {
  reason: "check" | "collect";
}

export interface BossEngaged {
  boss: string;
  level: string;
}

export interface GameEvent<T extends GameTopic = GameTopic> {
  type: T;
  sessionId: string;
  ts: number;
  data: EventData<T>;
}

export type EventData<T extends GameTopic> = T extends typeof GAME_TOPIC.areaEntered
  ? AreaEntered
  : T extends typeof GAME_TOPIC.levelStarted
    ? LevelStarted
    : T extends typeof GAME_TOPIC.levelCompleted
      ? LevelCompleted
      : T extends typeof GAME_TOPIC.inventoryOpened
        ? InventoryOpened
        : T extends typeof GAME_TOPIC.bossEngaged
          ? BossEngaged
          : never;
