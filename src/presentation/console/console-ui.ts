import { type EventBusService } from "../../application/event-bus/event-bus.service.js";
import {
  GAME_TOPIC,
  type GameEvent,
} from "../../domain/events/game-events.js";

/**
 * Formata a recomendação para o console: a origem, o perfil, a mensagem e
 * a evidência (a página da wiki que fundamenta a dica).
 */
export function formatRecommendation(
  event: GameEvent<"game/recommendations">,
): string {
  const { source, profile, message, evidence } = event.data;
  return [
    `[${event.ts}ms] [${source}] (perfil: ${profile})`,
    `  ${message}`,
    `  evidência: ${evidence.wikiPage}`,
  ].join("\n");
}

/**
 * Assina `game/recommendations` e imprime cada recomendação formatada.
 * O `out` é injetável para os testes (o padrão é o console.log).
 */
export function attachConsole(
  bus: EventBusService,
  out: (line: string) => void = (line) => console.log(line),
): void {
  bus.subscribe(GAME_TOPIC.recommendations, (e) => out(formatRecommendation(e)));
}
