import { scan } from "./commands/scan";

const COMMANDS: Record<string, (args: string[]) => Promise<void>> = {
  scan,
};

function usage(): void {
  console.log(`supernaturalist — analyze supernatural language in agent responses

Usage:
  supernaturalist <command> [options]

Commands:
  scan          Scan agent responses for supernatural terms

Options:
  --help, -h    Show this help message
  --version     Show version

Examples:
  supernaturalist scan
  supernaturalist scan --agent claude
  supernaturalist scan --since 2025-01-01`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "--help" || command === "-h") {
    usage();
    process.exit(0);
  }

  if (command === "--version") {
    console.log("0.1.0");
    process.exit(0);
  }

  const handler = command ? COMMANDS[command] : undefined;
  if (handler) {
    await handler(args.slice(1));
  } else {
    await scan(args);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
