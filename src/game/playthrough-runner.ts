import { type EventBusService } from "../application/event-bus/event-bus.service.js";
import {
  GAME_TOPIC,
  type GameEvent,
  type GameTopic,
} from "../domain/events/game-events.js";

export interface TimedEvent {
  event: GameEvent;
  delayMs: number;
}

export interface Fita {
  sessionId: string;
  timed: TimedEvent[];
}

const TELEMETRY_TOPICS: readonly string[] = Object.values(GAME_TOPIC).filter(
  (topic): topic is Exclude<GameTopic, typeof GAME_TOPIC.profileChanged | typeof GAME_TOPIC.recommendations> =>
    topic.startsWith("game/telemetry/"),
);

function isTelemetryTopic(topic: unknown): topic is GameTopic {
  return typeof topic === "string" && TELEMETRY_TOPICS.includes(topic);
}

/**
 * Valida a fita JSON e monta os eventos tipados — a fronteira entre o dado
 * (a fita gravada da sessão) e o sistema.
 */
export function parseFita(json: string): Fita {
  const raw = JSON.parse(json) as {
    sessionId?: unknown;
    entries?: unknown;
  };
  if (typeof raw.sessionId !== "string" || raw.sessionId.length === 0) {
    throw new Error("fita: sessionId ausente");
  }
  if (!Array.isArray(raw.entries)) {
    throw new Error("fita: entries deve ser uma lista");
  }
  const timed: TimedEvent[] = raw.entries.map((entry, i) => {
    const record = entry as { topic?: unknown; data?: unknown };
    if (!isTelemetryTopic(record.topic)) {
      throw new Error(`fita: tópico desconhecido na entrada ${i}`);
    }
    const topic = record.topic as GameTopic;
    return {
      event: {
        type: topic,
        sessionId: raw.sessionId as string,
        ts: 0,
        data: (record.data ?? {}) as Record<string, unknown>,
      } as unknown as GameEvent,
      delayMs: typeof (entry as { delayMs?: unknown }).delayMs === "number"
        ? (entry as { delayMs: number }).delayMs
        : 0,
    };
  });
  return { sessionId: raw.sessionId as string, timed };
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Publica os eventos da fita no barramento, respeitando o pacing
 * (`delayMs` ÷ speed entre eventos). O `ts` de cada evento é o tempo
 * acumulado da sessão — determinístico nos testes com `--speed 0`.
 */
export async function runPlaythrough(
  fita: Fita,
  bus: EventBusService,
  options: { speed?: number } = {},
): Promise<GameEvent[]> {
  const speed = options.speed ?? 1;
  const published: GameEvent[] = [];
  let elapsed = 0;
  for (const { event, delayMs } of fita.timed) {
    elapsed += delayMs;
    const wait = speed > 0 ? delayMs / speed : 0;
    if (wait > 0) await sleep(wait);
    bus.publish({
      type: event.type,
      sessionId: fita.sessionId,
      ts: elapsed,
      data: event.data,
    } as unknown as GameEvent);
    published.push({ ...event, ts: elapsed });
  }
  return published;
}
