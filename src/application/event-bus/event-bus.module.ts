import { EventEmitterModule } from "@nestjs/event-emitter";
import { Module } from "@nestjs/common";
import { EventBusService } from "./event-bus.service.js";

/**
 * O módulo de eventos: o barramento in-memory (EventEmitter2 síncrono)
 * exposto como serviço injetável. Os consumidores assinam tópicos; os
 * produtores publicam eventos.
 */
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
