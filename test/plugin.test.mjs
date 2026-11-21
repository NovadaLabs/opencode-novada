import { test } from "node:test";
import assert from "node:assert/strict";
import plugin from "../index.ts";

// Minimal fake of the plugin context: records what the plugin registers.
function makeCtx({ options = {}, existing = {} } = {}) {
  const calls = { mcpTransform: 0, mcpSet: [], skillAdd: [] };
  const ctx = {
    options,
    mcp: {
      async transform(cb) {
        calls.mcpTransform += 1;
        cb({
          get: (name) => existing[name],
          set: (name, config) => calls.mcpSet.push({ name, config }),
        });
        return { dispose: async () => {} };
      },
    },
    skill: {
      async transform(cb) {
        cb({ add: (skill) => calls.skillAdd.push(skill) });
        return { dispose: async () => {} };
      },
    },
  };
  return { ctx, calls };
}

test("has a stable id", () => {
  assert.equal(plugin.id, "novada");
});

test("registers the hosted MCP server by default", async () => {
  const { ctx, calls } = makeCtx();
  await plugin.setup(ctx);
  assert.equal(calls.mcpSet.length, 1);
  assert.equal(calls.mcpSet[0].name, "novada");
  assert.deepEqual(calls.mcpSet[0].config, { type: "remote", url: "https://mcp.novada.com/mcp" });
});

test("skips MCP registration when options.mcp is false", async () => {
  const { ctx, calls } = makeCtx({ options: { mcp: false } });
  await plugin.setup(ctx);
  assert.equal(calls.mcpTransform, 0);
  assert.equal(calls.mcpSet.length, 0);
  assert.equal(calls.skillAdd.length, 1);
});

test("does not override a server the user already configured", async () => {
  const { ctx, calls } = makeCtx({ existing: { novada: { type: "remote", url: "https://example.com/mcp" } } });
  await plugin.setup(ctx);
  assert.equal(calls.mcpSet.length, 0);
});

test("registers the novada skill", async () => {
  const { ctx, calls } = makeCtx();
  await plugin.setup(ctx);
  assert.equal(calls.skillAdd.length, 1);
  const skill = calls.skillAdd[0];
  assert.equal(skill.id, "novada");
  assert.equal(skill.name, "novada");
  assert.ok(skill.description.length > 0);
  assert.ok(skill.content.includes("novada_search"));
});
