import { EventEmitter2 } from "@nestjs/event-emitter";
import { beforeEach, describe, expect, it } from "vitest";
import {
  GAME_TOPIC,
  type GameEvent,
} from "../src/domain/events/game-events.js";
import { EventBusService } from "../src/application/event-bus/event-bus.service.js";
import {
  attachConsole,
  formatRecommendation,
} from "../src/presentation/console/console-ui.js";

function recommendationEvent(
  ts: number,
  message: string,
  profile: string,
  source: string,
  wikiPage: string,
): GameEvent<"game/recommendations"> {
  return {
    type: "game/recommendations",
    sessionId: "s1",
    ts,
    data: { source, profile, message, evidence: { wikiPage } },
  } as GameEvent<"game/recommendations">;
}

describe("formatRecommendation", () => {
  it("formata com a origem, o perfil, a mensagem e a evidência", () => {
    const line = formatRecommendation(
      recommendationEvent(
        250,
        "A saída normal de forest-of-illusion-4 não progride — o caminho é a saída secreta.",
        "casual",
        "progression-advisor",
        "openwiki/super-mario-world/levels/forest-of-illusion-4.md",
      ),
    );

    expect(line).toContain("[250ms]");
    expect(line).toContain("[progression-advisor]");
    expect(line).toContain("(perfil: casual)");
    expect(line).toContain("não progride");
    expect(line).toContain("evidência: openwiki/super-mario-world/levels/forest-of-illusion-4.md");
  });
});

describe("attachConsole", () => {
  it("imprime cada recomendação via o out injetado", () => {
    const saidas: string[] = [];
    const bus = new EventBusService(new EventEmitter2());
    attachConsole(bus, (line) => saidas.push(line));

    bus.publish(
      recommendationEvent(
        1,
        "Leve a Cape Feather para o castelo — voo planado nos obstáculos altos.",
        "casual",
        "world-advisor",
        "openwiki/super-mario-world/power-ups/cape-feather.md",
      ),
    );

    expect(saidas).toHaveLength(1);
    expect(saidas[0]).toContain("Cape Feather");
    expect(saidas[0]).toContain("world-advisor");
  });
});
