import { type PlayerProfile } from "../events/game-events.js";
import {
  type KnowledgeIndex,
  type KnowledgeLevel,
} from "../knowledge/knowledge-index.js";

export type AdvisorSource = "progression-advisor";

export interface PlayerWorldState {
  sessionId: string;
  profile: PlayerProfile;
  completedLevels: string[];
  secretExitsTaken: string[];
  bossesDefeated: string[];
  currentArea: string;
  bossEngaged?: { boss: string; level: string };
}

export function emptyWorldState(
  sessionId: string,
  profile: PlayerProfile,
): PlayerWorldState {
  return {
    sessionId,
    profile,
    completedLevels: [],
    secretExitsTaken: [],
    bossesDefeated: [],
    currentArea: "yoshis-island",
  };
}

export interface ProgressionRecommendation {
  source: AdvisorSource;
  profile: PlayerProfile;
  message: string;
  evidence: { wikiPage: string };
}

/** O estado de progresso da sessão, agregado da telemetria. */
export function observeWorld(
  state: PlayerWorldState,
  event: {
    type: string;
    ts: number;
    data: {
      area?: string;
      level?: string;
      exit?: string;
      boss?: string;
      reason?: string;
    };
  },
): PlayerWorldState {
  const next: PlayerWorldState = { ...state };
  if (event.type === "game/telemetry/area_entered" && event.data.area) {
    next.currentArea = event.data.area;
  }
  if (event.type === "game/telemetry/level_completed" && event.data.level) {
    const level = event.data.level;
    next.completedLevels = state.completedLevels.includes(level)
      ? state.completedLevels
      : [...state.completedLevels, level];
    if (event.data.exit !== undefined && event.data.exit !== "normal") {
      next.secretExitsTaken = state.secretExitsTaken.includes(level)
        ? state.secretExitsTaken
        : [...state.secretExitsTaken, level];
    }
  }
  if (event.type === "game/telemetry/boss_engaged" && event.data.boss) {
    next.bossEngaged = {
      boss: event.data.boss,
      level: event.data.level ?? "",
    };
  }
  return next;
}

/** A primeira área (pela ordem) cujo boss ainda não foi derrotado. */
export function nextGoalArea(
  index: KnowledgeIndex,
  state: PlayerWorldState,
): { area: string; castle: KnowledgeLevel } | undefined {
  const order = [...index.areas].sort((a, b) => a.order - b.order);
  for (const area of order) {
    if (area.id === "star-road") continue;
    const castle = index.levels.find(
      (level) =>
        level.area === area.id && level.boss && level.kind === "main",
    );
    if (!castle) continue;
    if (state.bossesDefeated.includes(castle.id)) continue;
    return { area: area.id, castle };
  }
  return undefined;
}

export function progressionRecommendation(
  index: KnowledgeIndex,
  state: PlayerWorldState,
): ProgressionRecommendation | undefined {
  // 1. O gating: nível cuja saída normal aponta para si mesmo (o loop da
  // Forest of Illusion) — o progresso exige o secret daquele nível.
  const looped = state.completedLevels.find((levelId) => {
    const level = index.levels.find((l) => l.id === levelId);
    const normal = level?.exits.find((exit) => exit.kind === "normal");
    return normal !== undefined && normal.goesTo === levelId;
  });
  if (looped !== undefined) {
    const secret = index.levels.find(
      (level) => level.id === looped,
    )?.exits.find((exit) => exit.kind === "secret");
    if (secret !== undefined) {
      return {
        source: "progression-advisor" as AdvisorSource,
        profile: state.profile,
        message: `A saída normal de ${looped} não progride — o caminho é a saída secreta, que leva a ${secret.goesTo}.`,
        evidence: { wikiPage: `openwiki/super-mario-world/levels/${looped}.md` },
      };
    }
  }

  // 2. O power-up: o boss engajado sem o power-up recomendado da área.
  if (state.bossEngaged !== undefined) {
    const castle = index.levels.find(
      (level) => level.id === state.bossEngaged?.level,
    );
    const powerUp = index.powerUps.find(
      (p) => p.recommendedFor.includes("castelos") && castle !== undefined,
    );
    if (powerUp !== undefined) {
      return {
        source: "progression-advisor" as AdvisorSource,
        profile: state.profile,
        message: `Boss em ${castle?.name ?? state.bossEngaged.level}: leve o ${powerUp.name} — ${powerUp.effect}.`,
        evidence: { wikiPage: `openwiki/super-mario-world/power-ups/${powerUp.id}.md` },
      };
    }
  }

  // 3. O próximo objetivo: a primeira área sem o boss derrotado.
  const goal = nextGoalArea(index, state);
  if (goal !== undefined) {
    return {
      source: "progression-advisor" as AdvisorSource,
      profile: state.profile,
      message: `Próximo objetivo: progredir na área ${goal.area} até o castelo ${goal.castle.name}.`,
      evidence: { wikiPage: `openwiki/super-mario-world/areas/${goal.area}.md` },
    };
  }
  return undefined;
}

export function levelWithSecret(index: KnowledgeIndex, id: string) {
  const level: KnowledgeLevel | undefined = index.levels.find((l) => l.id === id);
  return level;
}
