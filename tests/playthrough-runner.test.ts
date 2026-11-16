import { EventEmitter2 } from "@nestjs/event-emitter";
import { describe, expect, it } from "vitest";
import {
  GAME_TOPIC,
  type GameEvent,
  type GameTopic,
} from "../src/domain/events/game-events.js";
import {
  parseFita,
  runPlaythrough,
} from "../src/game/playthrough-runner.js";
import { EventBusService } from "../src/application/event-bus/event-bus.service.js";

const FITA_CASUAL_JSON = JSON.stringify({
  sessionId: "s1",
  entries: [
    { delayMs: 0, topic: "game/telemetry/area_entered", data: { area: "yoshis-island" } },
    { delayMs: 100, topic: "game/telemetry/level_started", data: { level: "yoshis-island-1" } },
    { delayMs: 200, topic: "game/telemetry/level_completed", data: { level: "yoshis-island-1", exit: "normal", durationMs: 120000 } },
    { delayMs: 150, topic: "game/telemetry/area_entered", data: { area: "forest-of-illusion" } },
    { delayMs: 100, topic: "game/telemetry/level_started", data: { level: "forest-of-illusion-4" } },
    { delayMs: 250, topic: "game/telemetry/level_completed", data: { level: "forest-of-illusion-4", exit: "normal", durationMs: 90000 } },
  ],
});

describe("parseFita", () => {
  it("valida e monta os eventos tipados na ordem da fita", () => {
    const fita = parseFita(FITA_CASUAL_JSON);
    expect(fita.sessionId).toBe("s1");
    expect(fita.timed).toHaveLength(6);
    expect(fita.timed[0]?.event.type).toBe("game/telemetry/area_entered");
  });

  it("rejeita tópico desconhecido (fora dos 5 canônicos)", () => {
    const json = JSON.stringify({
      sessionId: "s1",
      entries: [{ delayMs: 0, topic: "game/telemetry/quest_started", data: {} }],
    });
    expect(() => parseFita(json)).toThrowError(/tópico desconhecido/);
  });

  it("rejeita sessionId ausente", () => {
    const json = JSON.stringify({ entries: [] });
    expect(() => parseFita(json)).toThrowError(/sessionId/);
  });
});

describe("runPlaythrough", () => {
  it("publica os eventos na ordem com o ts acumulado (speed 0, instantâneo)", async () => {
    const fita = parseFita(FITA_CASUAL_JSON);
    const publicados: GameEvent[] = [];
    const bus = new EventBusService(new EventEmitter2());
    for (const topic of [
      GAME_TOPIC.areaEntered,
      GAME_TOPIC.levelStarted,
      GAME_TOPIC.levelCompleted,
    ]) {
      bus.subscribe(topic, (e) => publicados.push(e));
    }

    await runPlaythrough(fita, bus, { speed: 0 });

    expect(publicados).toHaveLength(6);
    expect(publicados.map((e) => e.ts)).toEqual([...publicados.map((e) => e.ts)].sort((a, b) => a - b));
  });

  it("respeita o pacing com speed 1 (a soma dos delays)", async () => {
    const fita = parseFita(FITA_CASUAL_JSON);
    const publicados: GameEvent[] = [];
    const bus = new EventBusService(new EventEmitter2());
    for (const topic of [
      GAME_TOPIC.areaEntered,
      GAME_TOPIC.levelStarted,
      GAME_TOPIC.levelCompleted,
    ]) {
      bus.subscribe(topic, (e) => publicados.push(e));
    }

    const inicio = Date.now();
    await runPlaythrough(fita, bus, { speed: 1000 });
    const duracao = Date.now() - inicio;

    const somaDelays = fita.timed.reduce((acc, t) => acc + t.delayMs, 0);
    expect(publicados).toHaveLength(6);
    expect(duracao).toBeGreaterThanOrEqual(Math.floor(somaDelays / 1000));
    expect(duracao).toBeLessThan(somaDelays);
  });
});
