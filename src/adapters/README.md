Adapters scan local agent session histories to supply assistant/agent response text for supernatural term detection.

Supported sources:
- Claude Code
- Codex
- OpenCode
- Amp (Sourcegraph)
- Cline/Roo
- Pi Agent
- Zed

Each adapter only yields assistant/agent messages, not user prompts. If a source is missing or its storage format changes, the adapter silently skips it.
