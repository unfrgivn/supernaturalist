import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Adapter, AdapterOptions, Message } from "./index";

/**
 * Codex stores sessions as JSONL files at:
 *   ~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl
 *
 * Each line is JSON with structure:
 *   { "timestamp": "...", "type": "response_item", "payload": { "type": "message", "role": "assistant", "content": [...] } }
 *
 * Assistant messages have payload.role === "assistant" and content is usually
 * an array of { "type": "output_text", "text": "..." } parts.
 */

const CODEX_SESSIONS_DIR = join(homedir(), ".codex", "sessions");

export function codexAdapter(): Adapter {
  return {
    name: "codex",
    async *messages(options?: AdapterOptions): AsyncGenerator<Message> {
      yield* walkCodexSessions(CODEX_SESSIONS_DIR, options);
    },
  };
}

async function* walkCodexSessions(
  dir: string,
  options?: AdapterOptions,
): AsyncGenerator<Message> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return; // Codex not installed or no sessions
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      yield* walkCodexSessions(fullPath, options);
    } else if (entry.endsWith(".jsonl")) {
      const session = entry.replace(".jsonl", "");
      const context = options?.since ? { session, since: options.since } : { session };
      yield* parseCodexJsonl(fullPath, context);
    }
  }
}

async function* parseCodexJsonl(
  filePath: string,
  context: { session: string; since?: Date },
): AsyncGenerator<Message> {
  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) {continue;}

    try {
      const entry = JSON.parse(line) as CodexEntry;

      if (entry.type !== "response_item") {continue;}

      const payload = entry.payload;
      if (!payload || payload.role !== "assistant") {continue;}

      const text = extractText(payload.content);
      if (!text) {continue;}

      if (context.since && entry.timestamp) {
        const ts = new Date(entry.timestamp);
        if (ts < context.since) {continue;}
      }

      const message: Message = entry.timestamp
        ? { text, timestamp: entry.timestamp, session: context.session }
        : { text, session: context.session };
      yield message;
    } catch {
      // Skip malformed lines
    }
  }
}

function extractText(content: unknown): string | null {
  if (!Array.isArray(content)) {return null;}

  const parts = content
    .filter(
      (p): p is { type: string; text: string } =>
        typeof p === "object" &&
        p !== null &&
        (p.type === "output_text" || p.type === "text") &&
        typeof p.text === "string",
    )
    .map((p) => p.text);

  return parts.length > 0 ? parts.join(" ") : null;
}

interface CodexEntry {
  timestamp?: string;
  type: string;
  payload?: {
    type?: string;
    role?: string;
    content?: unknown;
  };
}
