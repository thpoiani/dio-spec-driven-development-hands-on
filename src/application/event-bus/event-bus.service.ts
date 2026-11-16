import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { type GameEvent, type GameTopic } from "../../domain/events/game-events.js";

/**
 * O barramento de eventos in-memory — a seam única do sistema.
 *
 * Contrato: entrega síncrona, em série, na ordem de publicação. Um handler
 * que lança exceção é capturado e logado — os demais assinantes do mesmo
 * tópico recebem normalmente.
 *
 * O `topic` é o `type` do evento: publicar e assinar falam a mesma string,
 * e a migração para MQTT (etapa 07) troca o transporte sem tocar neste
 * contrato.
 */
@Injectable()
export class EventBusService {
  constructor(
    @Inject(EventEmitter2) private readonly emitter: EventEmitter2,
  ) {}

  publish<T extends GameTopic>(event: GameEvent<T>): void;
  publish(event: GameEvent): void;
  publish(event: GameEvent): void {
    this.emitter.emit(event.type, event);
  }

  subscribe<T extends GameTopic>(
    topic: T,
    handler: (event: GameEvent<T>) => void,
  ): void;
  subscribe(topic: string, handler: (event: GameEvent) => void): void;
  subscribe(topic: string, handler: (event: GameEvent) => void): void {
    this.emitter.on(topic, (event: GameEvent) => {
      try {
        handler(event);
      } catch (error) {
        console.error(
          `[event-bus] handler falhou no tópico "${topic}":`,
          error,
        );
      }
    });
  }
}
