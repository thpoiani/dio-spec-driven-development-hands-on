import { Module } from "@nestjs/common";
import { EventBusModule } from "../event-bus/event-bus.module.js";
import { KNOWLEDGE_INDEX } from "../../domain/knowledge/knowledge-index.js";
import { loadKnowledge } from "../../infrastructure/knowledge/knowledge-loader.js";
import { ProgressionAdvisorService } from "./progression-advisor.service.js";

/**
 * O advisor de progressão: assina a telemetria e o perfil, consulta o
 * KnowledgeIndex (carregado da wiki no boot) e publica recomendações.
 */
@Module({
  imports: [EventBusModule],
  providers: [
    ProgressionAdvisorService,
    {
      provide: KNOWLEDGE_INDEX,
      useValue: loadKnowledge("super-mario-world"),
    },
  ],
  exports: [ProgressionAdvisorService],
})
export class AdvisorModule {}
