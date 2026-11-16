import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import {
  type KnowledgeArea,
  type KnowledgeBoss,
  type KnowledgeIndex,
  type KnowledgeLevel,
  type KnowledgePowerUp,
  type KnowledgeSwitchPalace,
} from "../../domain/knowledge/knowledge-index.js";

export class KnowledgeLoaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KnowledgeLoaderError";
  }
}

const ENTITY_DIRS = [
  "areas",
  "levels",
  "power-ups",
  "bosses",
  "switch-palaces",
] as const;

const REQUIRED_FIELDS: Record<string, readonly string[]> = {
  area: ["id", "name", "order", "unlocks"],
  level: ["id", "name", "area", "kind", "exits", "prerequisites", "rewards", "boss"],
  "switch-palace": ["id", "name", "unlocks"],
  "power-up": ["id", "name", "effect", "recommendedFor"],
  boss: ["id", "name", "castle", "defeatedUnlocks"],
};

const TYPE_BY_DIR: Record<string, string> = {
  areas: "area",
  levels: "level",
  "power-ups": "power-up",
  bosses: "boss",
  "switch-palaces": "switch-palace",
};

function toCamel(key: string): string {
  return key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function normalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[toCamel(key)] = normalizeValue(item);
    }
    return out;
  }
  return value;
}

function normalizeObject(value: Record<string, unknown>): Record<string, unknown> {
  return normalizeValue(value) as Record<string, unknown>;
}

function schemaData(text: string, file: string): Record<string, unknown> {
  const fenced = text.match(/```yaml\n([\s\S]*?)\n```/);
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fenced && !frontmatter?.[1]) {
    throw new KnowledgeLoaderError(
      `${file}: bloco de dados (\`\`\`yaml) ausente`,
    );
  }
  try {
    const dados = (fenced?.[1] !== undefined ? parseYaml(fenced[1]) : {}) as Record<string, unknown>;
    const meta = (frontmatter?.[1] !== undefined ? parseYaml(frontmatter[1]) : {}) as Record<string, unknown>;
    if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
      throw new Error("o bloco de dados deve ser um mapa");
    }
    if (meta === null || typeof meta !== "object" || Array.isArray(meta)) {
      throw new Error("o frontmatter deve ser um mapa");
    }
    return { ...normalizeObject(meta), ...normalizeObject(dados) };
  } catch (error) {
    throw new KnowledgeLoaderError(
      `${file}: YAML inválido (${(error as Error).message})`,
    );
  }
}

function requireFields(
  data: Record<string, unknown>,
  required: readonly string[],
  file: string,
): void {
  for (const field of required) {
    const value = data[field];
    if (value === undefined || value === null || value === "") {
      throw new KnowledgeLoaderError(`${file}: campo obrigatório "${field}" ausente`);
    }
  }
}

export function loadKnowledge(gameSlug: string, root = "openwiki"): KnowledgeIndex {
  const gameDir = join(root, gameSlug);
  if (!existsSync(gameDir)) {
    throw new KnowledgeLoaderError(`${gameDir}: base de conhecimento do jogo ausente`);
  }

  const pages: {
    type: string;
    data: Record<string, unknown>;
  }[] = [];

  for (const dir of ENTITY_DIRS) {
    const dirPath = join(gameDir, dir);
    if (!existsSync(dirPath)) continue;
    const files = readdirSync(dirPath).filter(
      (f) => f.endsWith(".md") && f !== "index.md",
    );
    const expectedType = TYPE_BY_DIR[dir];
    if (!expectedType) {
      throw new KnowledgeLoaderError(
        `${dirPath}: diretório de entidades desconhecido`,
      );
    }
    for (const file of files) {
      const path = join(dirPath, file);
      const text = readFileSync(path, "utf8");
      const data = schemaData(text, path);
      const type = data["type"];
      if (typeof type !== "string" || type !== expectedType) {
        throw new KnowledgeLoaderError(
          `${path}: "type" esperado "${expectedType}", recebido ${JSON.stringify(type)}`,
        );
      }
      requireFields(data, REQUIRED_FIELDS[expectedType] ?? [], path);
      pages.push({ type: expectedType, data: normalizeObject(data) });
    }
  }

  const byType = (type: string) =>
    pages.filter((p) => p.type === type).map((p) => p.data);

  return {
    game: gameSlug,
    areas: byType("area") as unknown as KnowledgeArea[],
    levels: byType("level") as unknown as KnowledgeLevel[],
    switchPalaces: byType("switch-palace") as unknown as KnowledgeSwitchPalace[],
    powerUps: byType("power-up") as unknown as KnowledgePowerUp[],
    bosses: byType("boss") as unknown as KnowledgeBoss[],
  };
}
