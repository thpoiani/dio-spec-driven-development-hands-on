import { Inject, Injectable } from "@nestjs/common";
import {
  GAME_TOPIC,
  type GameEvent,
  type PlayerProfile,
} from "../../domain/events/game-events.js";
import { EventBusService } from "../event-bus/event-bus.service.js";
import {
  inferProfile,
  observe,
  type ProfileResult,
} from "../../domain/profiler/infer-profile.js";

interface ProfileSnapshot {
  profile: PlayerProfile;
  confidence: number;
  signals: string[];
}

/**
 * Assina a telemetria no construtor, agrega os sinais da sessão e publica
 * `game/profile_changed` — na primeira inferência (após o bootstrap) e em
 * mudanças. As regras de inferência são puras (`domain/profiler`).
 */
@Injectable()
export class PlayerProfilerService {
  private readonly sessions = new Map<string, GameEvent[]>();
  private readonly inferred = new Map<string, ProfileSnapshot>();

  constructor(
    @Inject(EventBusService) private readonly bus: EventBusService,
  ) {
    this.bus.subscribe(GAME_TOPIC.areaEntered, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelStarted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelCompleted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.inventoryOpened, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.bossEngaged, (e) => this.onTelemetry(e));
  }

  onModuleInit(): void {
    this.bus.subscribe(GAME_TOPIC.areaEntered, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelStarted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelCompleted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.inventoryOpened, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.bossEngaged, (e) => this.onTelemetry(e));
  }

  private onTelemetry(event: GameEvent): void {
    const state = this.sessions.get(event.sessionId) ?? [];
    const next = observe(state, event);
    this.sessions.set(event.sessionId, next);

    const result: ProfileResult | undefined = inferProfile(next);
    if (!result) return;

    const previous = this.inferred.get(event.sessionId);
    if (previous?.profile === result.profile) return;

    const snapshot: ProfileSnapshot = {
      profile: result.profile,
      confidence: result.confidence,
      signals: result.signals,
    };
    this.inferred.set(event.sessionId, snapshot);
    this.bus.publish({
      type: GAME_TOPIC.profileChanged,
      sessionId: event.sessionId,
      ts: event.ts,
      data: snapshot,
    });
  }
}
