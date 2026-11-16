import { Module } from "@nestjs/common";
import { EventBusModule } from "../event-bus/event-bus.module.js";
import { PlayerProfilerService } from "./player-profiler.service.js";

@Module({
  imports: [EventBusModule],
  providers: [PlayerProfilerService],
  exports: [PlayerProfilerService],
})
export class ProfilerModule {}
