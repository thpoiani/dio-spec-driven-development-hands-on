import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module.js";
import { EventBusService } from "../application/event-bus/event-bus.service.js";
import { attachConsole } from "../presentation/console/console-ui.js";
import { parseFita, runPlaythrough } from "./playthrough-runner.js";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const argValue = (key: string, fallback: string): string => {
  const found = args.find(
    (a) => a.startsWith(`--${key}=`) || a.startsWith(`${key}=`),
  );
  return found === undefined
    ? fallback
    : found.split("=").slice(1).join("=");
};

const fitaNome = argValue("fita", "casual");
const speed = Number(argValue("speed", "1"));

async function demo(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  await app.init();

  const bus = app.get(EventBusService);
  attachConsole(bus, (line) => console.log(line));

  const json = readFileSync(
    new URL(`./fitas/${fitaNome}.json`, import.meta.url),
    "utf8",
  );
  const fita = parseFita(json);

  console.log(`▶ Game Copilot — fita "${fitaNome}" (speed ${speed}x)\n`);
  await runPlaythrough(fita, bus, { speed });
  await app.close();
}

void demo();
