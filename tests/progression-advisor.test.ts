import { EventEmitter2 } from "@nestjs/event-emitter";
import { beforeEach, describe, expect, it } from "vitest";
import {
  GAME_TOPIC,
  type GameEvent,
  type GameTopic,
  type PlayerProfile,
} from "../src/domain/events/game-events.js";
import {
  type KnowledgeIndex,
  type KnowledgeLevel,
} from "../src/domain/knowledge/knowledge-index.js";
import { EventBusService } from "../src/application/event-bus/event-bus.service.js";
import { ProgressionAdvisorService } from "../src/application/advisor/progression-advisor.service.js";

interface RecommendationView {
  source: string;
  profile: string;
  message: string;
  evidence: { wikiPage: string };
  sessionId: string;
}

function level(
  id: string,
  area: string,
  kind: "main" | "side",
  boss: boolean,
  exits: { kind: string; goesTo: string }[],
): KnowledgeLevel {
  return {
    id,
    name: id,
    area,
    kind,
    exits: exits.map((e) => ({
      kind: e.kind as "normal" | "secret" | "keyhole",
      goesTo: e.goesTo,
    })),
    prerequisites: [],
    rewards: [],
    boss,
  };
}

const FIXTURE_INDEX: KnowledgeIndex = {
  game: "super-mario-world",
  areas: [
    { id: "yoshis-island", name: "Yoshi's Island", order: 1, unlocks: ["donut-plains"] },
    { id: "forest-of-illusion", name: "Forest of Illusion", order: 3, unlocks: ["chocolate-island"] },
  ],
  levels: [
    level("yoshis-island-1", "yoshis-island", "main", false, [{ kind: "normal", goesTo: "yoshis-island-2" }]),
    level("iggys-castle", "yoshis-island", "main", true, [{ kind: "normal", goesTo: "donut-plains-1" }]),
    level("forest-of-illusion-4", "forest-of-illusion", "main", false, [
      { kind: "normal", goesTo: "forest-of-illusion-4" },
      { kind: "secret", goesTo: "forest-secret-area" },
    ]),
    level("wendys-castle", "forest-of-illusion", "main", true, [{ kind: "normal", goesTo: "chocolate-island-1" }]),
  ],
  switchPalaces: [],
  powerUps: [
    { id: "cape-feather", name: "Cape Feather", effect: "voo planado", recommendedFor: ["castelos"] },
  ],
  bosses: [
    { id: "iggy", name: "Iggy", castle: "iggys-castle", defeatedUnlocks: ["donut-plains"] },
    { id: "wendy", name: "Wendy", castle: "wendys-castle", defeatedUnlocks: ["chocolate-island-1"] },
  ],
};

describe("ProgressionAdvisor (pela seam do barramento)", () => {
  let bus: EventBusService;
  let recommendations: RecommendationView[];

  beforeEach(() => {
    recommendations = [];
    bus = new EventBusService(new EventEmitter2());
    new ProgressionAdvisorService(bus, FIXTURE_INDEX);
    bus.subscribe("game/recommendations", (e) => {
      const data = e.data as unknown as Omit<RecommendationView, "sessionId">;
      recommendations.push({ ...data, sessionId: e.sessionId });
    });
  });

  it("detecta o gating: o loop da Forest of Illusion aponta a saída secreta", () => {
    bus.publish(
      makeEvent(GAME_TOPIC.areaEntered, "s1", 1, { area: "forest-of-illusion" }),
    );
    bus.publish(
      makeEvent(GAME_TOPIC.levelCompleted, "s1", 2, {
        level: "forest-of-illusion-4",
        exit: "normal",
        durationMs: 60_000,
      }),
    );

    const gating = recommendations.at(-1);
    expect(gating?.source).toBe("progression-advisor");
    expect(gating?.message).toContain("não progride");
    expect(gating?.evidence.wikiPage).toContain(
      "forest-of-illusion-4",
    );
  });

  it("sugere o power-up do contexto: boss_engaged em castelo pede a Cape", () => {
    bus.publish(
      makeEvent(GAME_TOPIC.bossEngaged, "s1", 2, {
        boss: "wendy",
        level: "wendys-castle",
      }),
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0]?.message).toContain("Cape Feather");
    expect(recommendations[0]?.evidence.wikiPage).toContain("cape-feather");
  });

  it("emite no máximo 1 recomendação por gatilho (sem duplicação)", () => {
    bus.publish(
      makeEvent(GAME_TOPIC.areaEntered, "s1", 1, { area: "yoshis-island" }),
    );
    bus.publish(
      makeEvent(GAME_TOPIC.areaEntered, "s1", 2, { area: "yoshis-island" }),
    );

    const objetivos = recommendations.filter((r) =>
      r.message.includes("objetivo"),
    );
    expect(objetivos.length).toBeLessThanOrEqual(1);
  });
});

function makeEvent<T extends GameTopic>(
  topic: T,
  sessionId: string,
  ts: number,
  data: Record<string, unknown> = {},
): GameEvent<T> {
  return { type: topic, sessionId, ts, data } as unknown as GameEvent<T>;
}

export type { PlayerProfile };
