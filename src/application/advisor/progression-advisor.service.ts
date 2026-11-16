import { Inject, Injectable } from "@nestjs/common";
import {
  GAME_TOPIC,
  type PlayerProfile,
} from "../../domain/events/game-events.js";
import { EventBusService } from "../event-bus/event-bus.service.js";
import {
  emptyWorldState,
  nextGoalArea,
  observeWorld,
  progressionRecommendation,
  type PlayerWorldState,
  type ProgressionRecommendation,
} from "../../domain/progression/progression-rules.js";
import {
  KNOWLEDGE_INDEX,
  type KnowledgeIndex,
} from "../../domain/knowledge/knowledge-index.js";

/**
 * Assina a telemetria e o perfil, consulta o `KnowledgeIndex` (in-memory,
 * carregado no boot) e publica `game/recommendations` — no máximo 1
 * recomendação por gatilho, prioridade gating > power-up > objetivo.
 */
@Injectable()
export class ProgressionAdvisorService {
  private readonly states = new Map<string, PlayerWorldState>();
  private readonly lastMessage = new Map<string, string>();

  constructor(
    @Inject(EventBusService) private readonly bus: EventBusService,
    @Inject(KNOWLEDGE_INDEX) private readonly index: KnowledgeIndex,
  ) {
    this.bus.subscribe(GAME_TOPIC.areaEntered, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelStarted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.levelCompleted, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.inventoryOpened, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.bossEngaged, (e) => this.onTelemetry(e));
    this.bus.subscribe(GAME_TOPIC.profileChanged, (e) => this.onProfile(e));
  }

  private stateOf(sessionId: string): PlayerWorldState {
    let state = this.states.get(sessionId);
    if (state === undefined) {
      state = emptyWorldState(sessionId, "casual");
      this.states.set(sessionId, state);
    }
    return state;
  }

  private onTelemetry(event: {
    sessionId: string;
    ts: number;
    type: string;
    data: {
      area?: string;
      level?: string;
      exit?: string;
      boss?: string;
      reason?: string;
    };
  }): void {
    const state = this.stateOf(event.sessionId);
    const next = observeWorld(state, {
      type: event.type,
      ts: event.ts,
      data: event.data,
    });
    this.states.set(event.sessionId, next);
    this.publishIfNew(
      next,
      progressionRecommendation(this.index, next),
      event.ts,
    );
  }

  private onProfile(event: {
    sessionId: string;
    ts: number;
    data: { profile: PlayerProfile };
  }): void {
    const state = this.stateOf(event.sessionId);
    const updated: PlayerWorldState = { ...state, profile: event.data.profile };
    this.states.set(event.sessionId, updated);
    this.publishIfNew(
      updated,
      progressionRecommendation(this.index, updated),
      event.ts,
    );
  }

  private publishIfNew(
    state: PlayerWorldState,
    recommendation: ProgressionRecommendation | undefined,
    ts: number,
  ): void {
    if (recommendation === undefined) return;
    const key = `${recommendation.profile}:${recommendation.message}`;
    if (this.lastMessage.get(state.sessionId) === key) return;
    this.lastMessage.set(state.sessionId, key);
    this.bus.publish({
      type: GAME_TOPIC.recommendations,
      sessionId: state.sessionId,
      ts,
      data: {
        source: recommendation.source,
        profile: recommendation.profile,
        message: recommendation.message,
        evidence: recommendation.evidence,
      },
    });
  }
}

export { nextGoalArea };
