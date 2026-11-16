// Valida o schema da base de conhecimento: toda página de entidade em
// openwiki/<game>/ precisa de um bloco ```yaml (Dados) com os campos
// obrigatórios do seu type. Páginas de índice (index.md) e meta
// (INSTRUCTIONS.md, quickstart.md, schema.md, world-map.md) ficam fora.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "openwiki";
const META_PAGES = new Set([
  "INSTRUCTIONS.md",
  "quickstart.md",
  "index.md",
  "schema.md",
  "world-map.md",
]);

const REQUIRED = {
  area: ["id", "name", "order", "unlocks"],
  level: ["id", "name", "area", "kind", "exits", "prerequisites", "rewards", "boss"],
  "switch-palace": ["id", "name", "unlocks"],
  "power-up": ["id", "name", "effect", "recommended-for"],
  boss: ["id", "name", "castle", "defeated-unlocks"],
};

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith(".md") && !META_PAGES.has(entry)) out.push(p);
  }
  return out;
}

function yamlBlock(text) {
  const fenced = text.match(/```yaml\n([\s\S]*?)\n```/);
  const raw = fenced ? fenced[1] : text.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!raw) return null;
  const data = {};
  let listKey = null;
  for (const line of raw.split("\n")) {
    if (listKey) {
      if (/^\s+- /.test(line)) data[listKey].push(line.replace(/^\s+- /, "").trim());
      else listKey = null;
    }
    const pair = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!pair) continue;
    const [, key, rawValue] = pair;
    if (rawValue === "") data[key] = [];
    else if (/^\[.*\]$/.test(rawValue)) data[key] = rawValue.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    else data[key] = rawValue;
    if (data[key] instanceof Array) listKey = key;
  }
  return data;
}

const failures = [];
const pages = walk(ROOT);
for (const file of pages) {
  const text = readFileSync(file, "utf8");
  const data = yamlBlock(text);
  if (!data) {
    failures.push(`${file}: sem bloco \`\`\`yaml (Dados)`);
    continue;
  }
  const type = data.type;
  const required = REQUIRED[type];
  if (!required) {
    failures.push(`${file}: type desconhecido "${type}"`);
    continue;
  }
  for (const field of required) {
    if (data[field] === undefined || data[field] === "") {
      failures.push(`${file}: campo obrigatório "${field}" ausente`);
    }
  }
}

if (pages.length === 0) failures.push(`${ROOT}: nenhuma página de entidade encontrada`);
if (failures.length > 0) {
  console.error(`check:wiki — ${failures.length} problema(s):\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`check:wiki — ${pages.length} páginas de entidade com schema completo ✓`);
