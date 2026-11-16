import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  await app.init();
  // O ciclo de vida das fitas de playthrough chega na etapa 05 (npm run demo).
}

void bootstrap();
