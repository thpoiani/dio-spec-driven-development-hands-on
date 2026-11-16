import "reflect-metadata";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module.js";

describe("AppModule", () => {
  it("compila como application context (console, sem HTTP)", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(AppModule)).toBeInstanceOf(AppModule);
  });
});
