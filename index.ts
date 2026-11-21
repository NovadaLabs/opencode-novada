import type { Plugin } from "@opencode/plugin";
import type { Skill } from "@opencode/schema";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const SERVER = "novada";
const ENDPOINT = "https://mcp.novada.com/mcp";

/**
 * Parse a SKILL.md file's frontmatter without a YAML dependency.
 * `description` must be a single line.
 */
function parseSkill(file: string): { name: string; description: string; body: string } {
  const raw = readFileSync(file, "utf8");
  const fence = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!fence) return { name: "novada", description: "", body: raw.trim() };
  const name = fence[1].match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? "novada";
  const description = fence[1].match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  return { name, description, body: raw.slice(fence[0].length).trim() };
}

export default {
  id: "novada",
  async setup(ctx) {
    // 1. Register the hosted Novada MCP server. Skipped when the user sets
    //    `options.mcp` to false, and never overrides a server the user already
    //    configured under the same name.
    if (ctx.options.mcp !== false) {
      await ctx.mcp.transform((editor) => {
        if (editor.get(SERVER)) return;
        editor.set(SERVER, { type: "remote", url: ENDPOINT });
      });
    }

    // 2. Register the skill that tells the agent when to use which Novada tool.
    const skillPath = join(dir, "skills", "novada", "SKILL.md");
    const { name, description, body } = parseSkill(skillPath);
    await ctx.skill.transform((editor) => {
      editor.add({
        id: "novada" as Skill.ID,
        name: name as Skill.Name,
        description,
        path: skillPath as Skill.Info["path"],
        content: body,
      });
    });
  },
} satisfies Plugin.Plugin;
