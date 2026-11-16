import { Module } from "@nestjs/common";
import { EventBusModule } from "./application/event-bus/event-bus.module.js";
import { ProfilerModule } from "./application/profiler/profiler.module.js";
import { AdvisorModule } from "./application/advisor/advisor.module.js";

/**
 * Módulo raiz do Game Copilot — o esqueleto DDD: domain/ (puro, sem Nest),
 * application/ (serviços), infrastructure/ (adapters), presentation/ (console).
 */
@Module({
  imports: [EventBusModule, ProfilerModule, AdvisorModule],
})
export class AppModule {}
