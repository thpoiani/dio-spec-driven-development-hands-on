import { EventEmitter2 } from "@nestjs/event-emitter";
import { beforeEach, describe, expect, it } from "vitest";
import {
  GAME_TOPIC,
  type GameEvent,
  type GameTopic,
} from "../src/domain/events/game-events.js";
import { EventBusService } from "../src/application/event-bus/event-bus.service.js";
import { PlayerProfilerService } from "../src/application/profiler/player-profiler.service.js";

interface ProfileChangedView {
  profile: string;
  confidence: number;
  signals: string[];
  sessionId: string;
}

function makeEvent<T extends GameTopic>(
  topic: T,
  sessionId: string,
  ts: number,
  data: Record<string, unknown> = {},
): GameEvent<T> {
  return { type: topic, sessionId, ts, data } as unknown as GameEvent<T>;
}

function publishLevel(
  bus: EventBusService,
  sessionId: string,
  ts: number,
  level: string,
  durationMs: number,
  exit: "normal" | "secret" | "keyhole" = "normal",
): void {
  bus.publish(makeEvent(GAME_TOPIC.levelStarted, sessionId, ts, { level }));
  bus.publish(
    makeEvent(GAME_TOPIC.levelCompleted, sessionId, ts + durationMs, {
      level,
      exit,
      durationMs,
    }),
  );
}

describe("PlayerProfiler (pela seam do barramento)", () => {
  let bus: EventBusService;
  let profiles: ProfileChangedView[];

  beforeEach(() => {
    profiles = [];
    bus = new EventBusService(new EventEmitter2());
    new PlayerProfilerService(bus);
    bus.subscribe("game/profile_changed", (e) => {
      const data = e.data as unknown as Omit<ProfileChangedView, "sessionId">;
      profiles.push({ ...data, sessionId: e.sessionId });
    });
  });

  it("não infere antes do bootstrap de 5 eventos de telemetria", () => {
    for (let i = 0; i < 4; i++) {
      bus.publish(
        makeEvent(GAME_TOPIC.areaEntered, "s1", i, { area: "yoshis-island" }),
      );
    }
    expect(profiles).toHaveLength(0);
  });

  it("classifica casual no default (sem segredos, níveis longos)", () => {
    publishLevel(bus, "s1", 0, "yoshis-island-1", 120_000);
    publishLevel(bus, "s1", 150_000, "yoshis-island-2", 130_000);
    publishLevel(bus, "s1", 300_000, "yoshis-island-3", 140_000);
    bus.publish(
      makeEvent(GAME_TOPIC.areaEntered, "s1", 450_000, {
        area: "yoshis-island",
      }),
    );

    expect(profiles).toHaveLength(1);
    expect(profiles[0]?.profile).toBe("casual");
    expect(profiles[0]?.confidence).toBe(1);
  });

  it("classifica speedrunner com níveis rápidos e zero segredos", () => {
    for (let i = 0; i < 3; i++) {
      publishLevel(bus, "s1", i * 40_000, `yoshis-island-${i + 1}`, 30_000);
    }
    bus.publish(
      makeEvent(GAME_TOPIC.levelCompleted, "s1", 130_000, {
        level: "yoshis-island-4",
        exit: "normal",
        durationMs: 40_000,
      }),
    );

    expect(profiles.at(-1)?.profile).toBe("speedrunner");
    expect(profiles.at(-1)?.confidence).toBe(1);
  });

  it("classifica completionist com secret exits suficientes", () => {
    publishLevel(bus, "s1", 0, "yoshis-island-1", 120_000, "secret");
    publishLevel(bus, "s1", 150_000, "yoshis-island-2", 130_000, "keyhole");
    bus.publish(
      makeEvent(GAME_TOPIC.areaEntered, "s1", 300_000, {
        area: "donut-plains",
      }),
    );

    expect(profiles.at(-1)?.profile).toBe("completionist");
    expect(profiles.at(-1)?.confidence).toBe(0.5);
  });

  it("prioriza speedrunner: rápido com segredos não é speedrunner", () => {
    for (let i = 0; i < 3; i++) {
      publishLevel(
        bus,
        "s1",
        i * 40_000,
        `yoshis-island-${i + 1}`,
        30_000,
        "secret",
      );
    }
    bus.publish(
      makeEvent(GAME_TOPIC.levelCompleted, "s1", 130_000, {
        level: "yoshis-island-4",
        exit: "normal",
        durationMs: 40_000,
      }),
    );

    expect(profiles.at(-1)?.profile).toBe("completionist");
  });
});
