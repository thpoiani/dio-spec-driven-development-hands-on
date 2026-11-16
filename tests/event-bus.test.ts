import "reflect-metadata";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { beforeEach, describe, expect, it } from "vitest";
import { GAME_TOPIC, type GameEvent, type GameTopic } from "../src/domain/events/game-events.js";
import { EventBusService } from "../src/application/event-bus/event-bus.service.js";

function makeEvent<T extends GameTopic>(
  topic: T,
  sessionId: string,
  ts: number,
): GameEvent<T> {
  return { type: topic, sessionId, ts, data: {} } as GameEvent<T>;
}

describe("EventBusService", () => {
  let bus: EventBusService;

  beforeEach(() => {
    bus = new EventBusService(new EventEmitter2());
  });

  it("entrega o evento ao assinante do tópico com o payload completo", () => {
    const recebidos: GameEvent[] = [];
    bus.subscribe(GAME_TOPIC.areaEntered, (e) => recebidos.push(e));

    const evento = makeEvent(GAME_TOPIC.areaEntered, "sessao-1", 1);
    bus.publish(evento);

    expect(recebidos).toHaveLength(1);
    expect(recebidos[0]?.type).toBe(GAME_TOPIC.areaEntered);
    expect(recebidos[0]?.sessionId).toBe("sessao-1");
  });

  it("entrega os eventos na ordem publicada", () => {
    const recebidos: number[] = [];
    bus.subscribe(GAME_TOPIC.levelCompleted, (e) => recebidos.push(e.ts));

    bus.publish(makeEvent(GAME_TOPIC.levelCompleted, "s1", 1));
    bus.publish(makeEvent(GAME_TOPIC.levelCompleted, "s1", 2));
    bus.publish(makeEvent(GAME_TOPIC.levelCompleted, "s1", 3));

    expect(recebidos).toEqual([1, 2, 3]);
  });

  it("não entrega eventos de outro tópico ao assinante (filtro)", () => {
    const recebidos: GameEvent[] = [];
    bus.subscribe(GAME_TOPIC.areaEntered, (e) => recebidos.push(e));

    bus.publish(makeEvent(GAME_TOPIC.levelCompleted, "s1", 1));

    expect(recebidos).toHaveLength(0);
  });

  it("entrega a múltiplos assinantes do mesmo tópico", () => {
    const primeiro: GameEvent[] = [];
    const segundo: GameEvent[] = [];
    bus.subscribe(GAME_TOPIC.bossEngaged, (e) => primeiro.push(e));
    bus.subscribe(GAME_TOPIC.bossEngaged, (e) => segundo.push(e));

    bus.publish(makeEvent(GAME_TOPIC.bossEngaged, "s1", 1));

    expect(primeiro).toHaveLength(1);
    expect(segundo).toHaveLength(1);
  });

  it("isola a falha: handler que lança não derruba os demais assinantes", () => {
    const recebidos: GameEvent[] = [];
    bus.subscribe(GAME_TOPIC.areaEntered, () => {
      throw new Error("handler quebrado");
    });
    bus.subscribe(GAME_TOPIC.areaEntered, (e) => recebidos.push(e));

    bus.publish(makeEvent(GAME_TOPIC.areaEntered, "s1", 1));

    expect(recebidos).toHaveLength(1);
  });

  it("entrega a rajada densa de 500 eventos íntegra e em ordem", () => {
    const recebidos: number[] = [];
    bus.subscribe(GAME_TOPIC.levelCompleted, (e) => recebidos.push(e.ts));

    const total = 500;
    for (let i = 0; i < total; i++) {
      bus.publish(makeEvent(GAME_TOPIC.levelCompleted, "rajada", i));
    }

    expect(recebidos).toHaveLength(total);
    expect(recebidos).toEqual([...Array(total).keys()]);
  });
});
