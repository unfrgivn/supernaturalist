# supernaturalist

Analyze supernatural language in your coding agent responses. `supernaturalist` scans local agent histories and reports occurrences of spectral terms like `ghost`, `ghoul`, `haunted`, `cursed`, and more in the assistant side of the transcript.

## Install

```bash
npm install -g supernaturalist
```

## CLI

```bash
supernaturalist scan
supernaturalist scan --agent claude
supernaturalist scan --since 2025-01-01
```

### Options

- `--agent`, `-a` Scan only a specific agent (claude, codex, opencode, amp, cline, pi, zed)
- `--since`, `-s` Only scan messages after this date (ISO 8601)
- `--help`, `-h` Show help

## Library

```ts
import { detect, createDetector } from "supernaturalist";

const result = detect("The haunted house hid a ghoul.");
console.log(result.count);

const custom = createDetector([
  { word: "cryptid", intensity: "vivid", group: "cryptid" },
]);
console.log(custom("A cryptid sighting."));
```

### API

- `detect(text: string): DetectionResult`
- `createDetector(extraWords?: WordEntry[]): (text: string) => DetectionResult`

Types:

```ts
export interface DetectionResult {
  count: number;
  matches: Match[];
}

export interface Match {
  word: string;
  index: number;
  intensity: "subtle" | "vivid" | "ominous";
  group: string;
}

export interface WordEntry {
  word: string;
  intensity: "subtle" | "vivid" | "ominous";
  group: string;
}
```

## Adapters

Adapters pull assistant/agent messages from local agent history stores. They are best-effort and will skip if a source is missing. See `src/adapters` for implementation details.

## Attribution

This project is adapted from https://github.com/gricha/devrage.

## Publishing

The GitHub Actions publish workflow uses npm Trusted Publishing with GitHub OIDC,
not a classic npm token. Configure the package on npmjs.com with this trusted
publisher:

- Repository: `unfrgivn/supernaturalist`
- Workflow: `.github/workflows/publish.yml`
- Environment: leave blank unless the workflow is updated to use one

The workflow publishes on pushes to `main` or manual dispatch. It runs typecheck,
lint, build, and test, increments the patch version with `npm version patch`,
publishes with `npm publish --access public --provenance`, then pushes the release
commit and tag back to `main`.
