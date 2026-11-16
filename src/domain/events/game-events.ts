// Tipos canônicos de telemetria do jogo — a linguagem do glossário vivendo no código.
// Vocabulário: Super Mario World — *Avoid* "quest" e "batalha" (são level e boss_engaged).

export const GAME_TOPIC = {
  areaEntered: "game/telemetry/area_entered",
  levelStarted: "game/telemetry/level_started",
  levelCompleted: "game/telemetry/level_completed",
  inventoryOpened: "game/telemetry/inventory_opened",
  bossEngaged: "game/telemetry/boss_engaged",
  profileChanged: "game/profile_changed",
  recommendations: "game/recommendations",
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

export type PlayerProfile = "casual" | "completionist" | "speedrunner";

export interface AreaEnteredData {
  area: AreaId;
}

export interface LevelStartedData {
  level: string;
}

export interface LevelCompletedData {
  level: string;
  exit: ExitKind;
  durationMs: number;
}

export interface InventoryOpenedData {
  reason: "check" | "collect";
}

export interface BossEngagedData {
  boss: string;
  level: string;
}

export interface ProfileChangedData {
  profile: PlayerProfile;
  confidence: number;
  signals: string[];
}

export interface GameEventBase<T extends GameTopic> {
  sessionId: string;
  ts: number;
}

export type EventPayload<T extends GameTopic> = T extends typeof GAME_TOPIC.areaEntered
  ? AreaEnteredData
  : T extends typeof GAME_TOPIC.levelStarted
    ? LevelStartedData
    : T extends typeof GAME_TOPIC.levelCompleted
      ? LevelCompletedData
      : T extends typeof GAME_TOPIC.inventoryOpened
        ? InventoryOpenedData
        : T extends typeof GAME_TOPIC.bossEngaged
          ? BossEngagedData
          : T extends typeof GAME_TOPIC.profileChanged
            ? ProfileChangedData
            : never;

export type GameEvent<T extends GameTopic = GameTopic> = T extends GameTopic
  ? {
      type: T;
      sessionId: string;
      ts: number;
      data: EventPayload<T>;
    }
  : never;
