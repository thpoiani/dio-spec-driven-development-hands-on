// As regras puras de inferência de perfil — sem Nest, testáveis sem framework.
// A linguagem do domínio: perfis casual, completionist e speedrunner.

import {
  GAME_TOPIC,
  type GameEvent,
  type PlayerProfile,
} from "../events/game-events.js";

export const BOOTSTRAP_EVENTS = 5;
const SPEED_MEDIAN_MS = 60_000;
const COMPLETION_SECRETS = 2;
const COMPLETION_COLLECTS = 4;

export interface ProfileResult {
  profile: PlayerProfile;
  confidence: number;
  signals: string[];
}

type LevelCompletedEvent = Extract<
  GameEvent,
  { type: typeof GAME_TOPIC.levelCompleted }
>;
type InventoryOpenedEvent = Extract<
  GameEvent,
  { type: typeof GAME_TOPIC.inventoryOpened }
>;

export function observe(
  state: readonly GameEvent[],
  event: GameEvent,
): GameEvent[] {
  return [...state, event];
}

function medianOf(values: number[]): number {
  if (values.length === 0) return Number.POSITIVE_INFINITY;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

export interface ProfilerSignals {
  medianFast: boolean;
  noSecrets: boolean;
  plentySecrets: boolean;
  plentyCollects: boolean;
}

export function collectSignals(state: readonly GameEvent[]): ProfilerSignals {
  const completions = state.filter(
    (e): e is LevelCompletedEvent => e.type === GAME_TOPIC.levelCompleted,
  );
  const durations = completions.map((e) => e.data.durationMs);
  const secrets = completions.filter((e) => e.data.exit !== "normal").length;
  const collects = state.filter(
    (e): e is InventoryOpenedEvent =>
      e.type === GAME_TOPIC.inventoryOpened && e.data.reason === "collect",
  ).length;
  return {
    medianFast: durations.length > 0 && medianOf(durations) < SPEED_MEDIAN_MS,
    noSecrets: secrets === 0,
    plentySecrets: secrets >= COMPLETION_SECRETS,
    plentyCollects: collects >= COMPLETION_COLLECTS,
  };
}

export function inferProfile(
  state: readonly GameEvent[],
): ProfileResult | undefined {
  if (state.length < BOOTSTRAP_EVENTS) return undefined;
  const { medianFast, noSecrets, plentySecrets, plentyCollects } =
    collectSignals(state);

  if (medianFast && noSecrets) {
    return {
      profile: "speedrunner",
      confidence: 1,
      signals: ["mediana-rapida", "sem-segredos"],
    };
  }
  if (plentySecrets || plentyCollects) {
    const confidence = plentySecrets && plentyCollects ? 1 : 0.5;
    return {
      profile: "completionist",
      confidence,
      signals: ["segredos", "coletas"],
    };
  }
  return {
    profile: "casual",
    confidence: 1,
    signals: ["sem-segredos", "sem-pressa"],
  };
}
