import "reflect-metadata";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  areasInOrder,
  levelById,
  levelsByArea,
  type KnowledgeIndex,
} from "../src/domain/knowledge/knowledge-index.js";
import {
  KnowledgeLoaderError,
  loadKnowledge,
} from "../src/infrastructure/knowledge/knowledge-loader.js";

const FIXTURE_LEVEL = (): string => [
  "```yaml",
  "type: level",
  "id: forest-of-illusion-4",
  "name: Forest of Illusion 4",
  "area: forest-of-illusion",
  "kind: main",
  "exits:",
  "  - kind: normal",
  "    goes-to: forest-of-illusion-4",
  "  - kind: secret",
  "    goes-to: forest-secret-area",
  "prerequisites: [forest-of-illusion-3]",
  "rewards: []",
  "boss: false",
  "```",
  "",
  "A saída normal da Forest of Illusion 4 não progride.",
].join("\n");

let fixtureRootDir: string | undefined;

function fixtureRoot(): string {
  fixtureRootDir = mkdtempSync(join(tmpdir(), "wiki-fixture-"));
  return fixtureRootDir;
}

function writePage(root: string, dir: string, file: string, body: string): void {
  const dirPath = join(root, "jogo-teste", dir);
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, file), body);
}

afterEach(() => {
  if (fixtureRootDir) rmSync(fixtureRootDir, { recursive: true, force: true });
  fixtureRootDir = undefined;
});

describe("loadKnowledge (fixtures)", () => {
  it("monta o índice a partir das páginas do jogo e responde consultas", () => {
    const root = fixtureRoot();
    writePage(root, "levels", "forest-of-illusion-4.md", FIXTURE_LEVEL());
    const index: KnowledgeIndex = loadKnowledge("jogo-teste", root);

    expect(index.game).toBe("jogo-teste");
    const nivel = levelById(index, "forest-of-illusion-4");
    expect(nivel?.area).toBe("forest-of-illusion");
    expect(levelsByArea(index, "forest-of-illusion")).toHaveLength(1);
  });

  it("normaliza chaves kebab-case para camelCase no índice", () => {
    const root = fixtureRoot();
    writePage(root, "levels", "forest-of-illusion-4.md", FIXTURE_LEVEL());
    const index: KnowledgeIndex = loadKnowledge("jogo-teste", root);

    const nivel = levelById(index, "forest-of-illusion-4");
    expect(nivel?.exits[0]).toEqual({
      kind: "normal",
      goesTo: "forest-of-illusion-4",
    });
    expect(nivel?.exits[1]?.kind).toBe("secret");
  });

  it("derruba o load com arquivo + campo quando o campo obrigatório falta", () => {
    const root = fixtureRoot();
    const semNome = FIXTURE_LEVEL().replace("name: Forest of Illusion 4\n", "");
    writePage(root, "levels", "quebrada.md", semNome);

    expect(() => loadKnowledge("jogo-teste", root)).toThrowError(
      /quebrada\.md.*campo obrigatório "name" ausente/,
    );
  });

  it("derruba o load quando o type não corresponde à pasta", () => {
    const root = fixtureRoot();
    const pagina = FIXTURE_LEVEL().replace("type: level", "type: power-up");
    writePage(root, "levels", "tipo-errado.md", pagina);

    expect(() => loadKnowledge("jogo-teste", root)).toThrowError(
      /tipo-errado\.md.*esperado "level"/,
    );
  });

  it("derruba o load quando a página não tem bloco de dados", () => {
    const root = fixtureRoot();
    writePage(root, "levels", "sem-bloco.md", "# Só prosa, sem yaml\n");
    writePage(root, "levels", "ok.md", FIXTURE_LEVEL());

    expect(() => loadKnowledge("jogo-teste", root)).toThrowError(
      /sem-bloco\.md.*bloco de dados/,
    );
  });

  it("rejeita base de conhecimento ausente", () => {
    const root = fixtureRoot();
    expect(() => loadKnowledge("jogo-inexistente", root)).toThrowError(
      /ausente/,
    );
  });
});

describe("loadKnowledge — integração com as páginas reais de SMW", () => {
  const index: KnowledgeIndex = loadKnowledge(
    "super-mario-world",
    "openwiki",
  );

  it("carrega o mundo curado completo", () => {
    expect(index.areas).toHaveLength(6);
    expect(index.levels.length).toBeGreaterThanOrEqual(20);
    expect(index.powerUps).toHaveLength(3);
    expect(index.bosses).toHaveLength(5);
    expect(index.switchPalaces.length).toBeGreaterThanOrEqual(2);
  });

  it("responde o gating canônico validado na Super Mario Wiki", () => {
    const foi4 = levelById(index, "forest-of-illusion-4");
    expect(
      foi4?.exits.some(
        (e) => e.kind === "secret" && e.goesTo === "forest-secret-area",
      ),
    ).toBe(true);

    const dsh = levelById(index, "donut-secret-house");
    expect(
      dsh?.exits.some((e) => e.kind === "secret" && e.goesTo === "star-world-1"),
    ).toBe(true);

    const vgh = levelById(index, "valley-ghost-house");
    expect(
      vgh?.exits.some((e) => e.kind === "secret" && e.goesTo === "larrys-castle"),
    ).toBe(true);
  });

  it("ordena as áreas pelo progresso do caminho principal", () => {
    const ordem = areasInOrder(index).map((a) => a.id);
    expect(ordem[0]).toBe("yoshis-island");
    expect(ordem.at(-1)).toBe("star-road");
  });
});
