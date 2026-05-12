import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Adapter, AdapterOptions, Message } from "./index";

/**
 * Claude Code stores sessions as JSONL files at:
 *   ~/.claude/projects/<project-path>/<session-uuid>.jsonl
 *
 * Each line is a JSON object. Assistant messages have:
 *   { "type": "assistant", "message": { "content": [...] } }
 * or sometimes:
 *   { "role": "assistant", "content": "..." }
 */

const CLAUDE_DIR = join(homedir(), ".claude", "projects");

export function claudeAdapter(): Adapter {
  return {
    name: "claude",
    async *messages(options?: AdapterOptions): AsyncGenerator<Message> {
      const projectsDir = CLAUDE_DIR;

      let projectDirs: string[];
      try {
        projectDirs = await readdir(projectsDir);
      } catch {
        return; // Claude Code not installed or no sessions
      }

      for (const projectDir of projectDirs) {
        const projectPath = join(projectsDir, projectDir);
        const projectStat = await stat(projectPath);
        if (!projectStat.isDirectory()) {continue;}

        const entries = await readdir(projectPath);
        const jsonlFiles = entries.filter((f) => f.endsWith(".jsonl"));

        for (const file of jsonlFiles) {
          const filePath = join(projectPath, file);
          const session = file.replace(".jsonl", "");

          const context = options?.since
            ? { session, project: projectDir, since: options.since }
            : { session, project: projectDir };
          yield* parseClaudeJsonl(filePath, context);
        }

        const subdirs = entries.filter((f) => !f.includes("."));
        for (const subdir of subdirs) {
          const subagentsDir = join(projectPath, subdir, "subagents");
          try {
            const subFiles = await readdir(subagentsDir);
            const subJsonl = subFiles.filter((f) => f.endsWith(".jsonl"));
            for (const file of subJsonl) {
              const context = options?.since
                ? {
                    session: `${subdir}/${file.replace(".jsonl", "")}`,
                    project: projectDir,
                    since: options.since,
                  }
                : {
                    session: `${subdir}/${file.replace(".jsonl", "")}`,
                    project: projectDir,
                  };
              yield* parseClaudeJsonl(join(subagentsDir, file), context);
            }
          } catch {
            // No subagents directory, skip
          }
        }
      }
    },
  };
}

async function* parseClaudeJsonl(
  filePath: string,
  context: { session: string; project: string; since?: Date },
): AsyncGenerator<Message> {
  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) {continue;}

    try {
      const entry = JSON.parse(line) as Record<string, unknown>;
      const text = extractAssistantText(entry);
      if (!text) {continue;}

      const timestamp = extractTimestamp(entry);
      if (context.since && timestamp) {
        const ts = new Date(timestamp);
        if (ts < context.since) {continue;}
      }

      const message: Message = timestamp
        ? {
            text,
            timestamp,
            session: context.session,
            project: context.project,
          }
        : {
            text,
            session: context.session,
            project: context.project,
          };
      yield message;
    } catch {
      // Skip malformed lines
    }
  }
}

function extractAssistantText(entry: Record<string, unknown>): string | null {
  if (entry["type"] === "assistant") {
    const message = entry["message"] as Record<string, unknown> | undefined;
    if (!message) {return null;}
    return contentToString(message["content"]);
  }

  if (entry["role"] === "assistant") {
    return contentToString(entry["content"]);
  }

  return null;
}

function contentToString(content: unknown): string | null {
  if (typeof content === "string") {return content;}
  if (Array.isArray(content)) {
    const parts = content
      .filter(
        (p): p is { type: string; text: string } =>
          typeof p === "object" && p !== null && p.type === "text",
      )
      .map((p) => p.text);
    return parts.length > 0 ? parts.join(" ") : null;
  }
  return null;
}

function extractTimestamp(entry: Record<string, unknown>): string | null {
  if (typeof entry["timestamp"] === "string") {return entry["timestamp"];}
  if (typeof entry["createdAt"] === "string") {return entry["createdAt"];}
  return null;
}
