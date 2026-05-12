import { detect, createDetector } from "../dist/lib/detector/index.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${String(expected)}, got ${String(actual)}`);
  }
}

const basic = detect("A haunted house hides a ghost and a ghoul.");
assertEqual(basic.count, 3, "detect should count supernatural terms");
assert(basic.matches.some((m) => m.group === "haunt"), "should include haunt group");
assert(basic.matches.some((m) => m.group === "ghost"), "should include ghost group");
assert(basic.matches.some((m) => m.group === "ghoul"), "should include ghoul group");

const collapsed = detect("A ghooost and haaauuunted hall.");
assert(collapsed.count >= 2, "should detect collapsed repeats");

const custom = createDetector([
  { word: "cryptid", intensity: "vivid", group: "cryptid" },
]);
const customResult = custom("A cryptid appears.");
assertEqual(customResult.count, 1, "custom detector should count custom words");

console.log("detector tests passed");
