export interface DetectionResult {
  /** Total supernatural terms found in the text */
  count: number;
  /** Individual matches */
  matches: Match[];
}

export interface Match {
  word: string;
  index: number;
  intensity: Intensity;
  group: string;
}

export type Intensity = "subtle" | "vivid" | "ominous";

interface WordDef {
  word: string;
  intensity: Intensity;
  group: string;
}

/**
 * Core wordlist: canonical forms, conjugations, compound words, and common typos.
 * Grouped by root word for reporting rollup.
 */
const WORDLIST: WordDef[] = [
  // === GHOST family (vivid) ===
  { word: "ghost", intensity: "vivid", group: "ghost" },
  { word: "ghosts", intensity: "vivid", group: "ghost" },
  { word: "ghostly", intensity: "vivid", group: "ghost" },
  { word: "ghosted", intensity: "vivid", group: "ghost" },
  { word: "ghosting", intensity: "vivid", group: "ghost" },
  { word: "ghostwriter", intensity: "subtle", group: "ghost" },

  // === HAUNT family (ominous) ===
  { word: "haunt", intensity: "ominous", group: "haunt" },
  { word: "haunted", intensity: "ominous", group: "haunt" },
  { word: "haunting", intensity: "ominous", group: "haunt" },
  { word: "haunts", intensity: "ominous", group: "haunt" },
  { word: "hauntings", intensity: "ominous", group: "haunt" },

  // === CURSE family (ominous) ===
  { word: "curse", intensity: "ominous", group: "curse" },
  { word: "cursed", intensity: "ominous", group: "curse" },
  { word: "curses", intensity: "ominous", group: "curse" },
  { word: "cursing", intensity: "ominous", group: "curse" },
  { word: "cursedness", intensity: "ominous", group: "curse" },

  // === GHOUL family (vivid) ===
  { word: "ghoul", intensity: "vivid", group: "ghoul" },
  { word: "ghouls", intensity: "vivid", group: "ghoul" },
  { word: "ghoulish", intensity: "vivid", group: "ghoul" },

  // === GOBLIN family (vivid) ===
  { word: "goblin", intensity: "vivid", group: "goblin" },
  { word: "goblins", intensity: "vivid", group: "goblin" },
  { word: "gobliny", intensity: "subtle", group: "goblin" },

  // === SPECTER family (vivid) ===
  { word: "specter", intensity: "vivid", group: "specter" },
  { word: "specters", intensity: "vivid", group: "specter" },
  { word: "spectral", intensity: "vivid", group: "specter" },

  // === PHANTOM family (vivid) ===
  { word: "phantom", intensity: "vivid", group: "phantom" },
  { word: "phantoms", intensity: "vivid", group: "phantom" },

  // === WRAITH family (ominous) ===
  { word: "wraith", intensity: "ominous", group: "wraith" },
  { word: "wraiths", intensity: "ominous", group: "wraith" },
  { word: "wraithlike", intensity: "ominous", group: "wraith" },

  // === APPARITION family (vivid) ===
  { word: "apparition", intensity: "vivid", group: "apparition" },
  { word: "apparitions", intensity: "vivid", group: "apparition" },
  { word: "apparitional", intensity: "vivid", group: "apparition" },

  // === POLTERGEIST family (ominous) ===
  { word: "poltergeist", intensity: "ominous", group: "poltergeist" },
  { word: "poltergeists", intensity: "ominous", group: "poltergeist" },

  // === DEMON family (ominous) ===
  { word: "demon", intensity: "ominous", group: "demon" },
  { word: "demons", intensity: "ominous", group: "demon" },
  { word: "demonic", intensity: "ominous", group: "demon" },

  // === UNDEAD family (vivid) ===
  { word: "undead", intensity: "vivid", group: "undead" },
  { word: "lich", intensity: "ominous", group: "undead" },
  { word: "liches", intensity: "ominous", group: "undead" },
  { word: "revenant", intensity: "ominous", group: "undead" },
  { word: "revenants", intensity: "ominous", group: "undead" },

  // === ZOMBIE family (vivid) ===
  { word: "zombie", intensity: "vivid", group: "zombie" },
  { word: "zombies", intensity: "vivid", group: "zombie" },
  { word: "zombified", intensity: "vivid", group: "zombie" },
  { word: "zombifying", intensity: "vivid", group: "zombie" },

  // === VAMPIRE family (ominous) ===
  { word: "vampire", intensity: "ominous", group: "vampire" },
  { word: "vampires", intensity: "ominous", group: "vampire" },
  { word: "vampiric", intensity: "ominous", group: "vampire" },
  { word: "vampirism", intensity: "ominous", group: "vampire" },

  // === WEREWOLF family (ominous) ===
  { word: "werewolf", intensity: "ominous", group: "werewolf" },
  { word: "werewolves", intensity: "ominous", group: "werewolf" },
  { word: "lycan", intensity: "ominous", group: "werewolf" },
  { word: "lycans", intensity: "ominous", group: "werewolf" },
  { word: "lycanthrope", intensity: "ominous", group: "werewolf" },
  { word: "lycanthropy", intensity: "ominous", group: "werewolf" },

  // === WITCH family (vivid) ===
  { word: "witch", intensity: "vivid", group: "witch" },
  { word: "witches", intensity: "vivid", group: "witch" },
  { word: "witchcraft", intensity: "vivid", group: "witch" },
  { word: "witchy", intensity: "subtle", group: "witch" },

  // === WARLOCK family (vivid) ===
  { word: "warlock", intensity: "vivid", group: "warlock" },
  { word: "warlocks", intensity: "vivid", group: "warlock" },

  // === SORCERY family (vivid) ===
  { word: "sorcery", intensity: "vivid", group: "sorcery" },
  { word: "sorcerer", intensity: "vivid", group: "sorcery" },
  { word: "sorcerers", intensity: "vivid", group: "sorcery" },
  { word: "sorcerous", intensity: "vivid", group: "sorcery" },

  // === SPELL family (subtle) ===
  { word: "spell", intensity: "subtle", group: "spell" },
  { word: "spells", intensity: "subtle", group: "spell" },
  { word: "spellbound", intensity: "vivid", group: "spell" },
  { word: "spellbinding", intensity: "vivid", group: "spell" },
  { word: "spellbook", intensity: "vivid", group: "spell" },
  { word: "spellcasting", intensity: "vivid", group: "spell" },

  // === HEX family (ominous) ===
  { word: "hex", intensity: "ominous", group: "hex" },
  { word: "hexed", intensity: "ominous", group: "hex" },
  { word: "hexes", intensity: "ominous", group: "hex" },
  { word: "hexing", intensity: "ominous", group: "hex" },

  // === GRIMOIRE family (vivid) ===
  { word: "grimoire", intensity: "vivid", group: "grimoire" },
  { word: "grimoires", intensity: "vivid", group: "grimoire" },

  // === ELDRITCH family (ominous) ===
  { word: "eldritch", intensity: "ominous", group: "eldritch" },
  { word: "eldritchy", intensity: "ominous", group: "eldritch" },

  // === CURSED OBJECTS ===
  { word: "hauntedhouse", intensity: "ominous", group: "haunt" },
  { word: "hauntingly", intensity: "ominous", group: "haunt" },
  { word: "cursedobject", intensity: "ominous", group: "curse" },

  // === OTHER SUPERNATURAL ===
  { word: "possessed", intensity: "ominous", group: "possession" },
  { word: "possession", intensity: "ominous", group: "possession" },
  { word: "possess", intensity: "ominous", group: "possession" },
  { word: "exorcism", intensity: "ominous", group: "exorcism" },
  { word: "exorcist", intensity: "ominous", group: "exorcism" },
  { word: "seance", intensity: "vivid", group: "seance" },
  { word: "séance", intensity: "vivid", group: "seance" },
  { word: "medium", intensity: "subtle", group: "medium" },
  { word: "mediums", intensity: "subtle", group: "medium" },
  { word: "ouija", intensity: "vivid", group: "ouija" },
  { word: "hauntology", intensity: "subtle", group: "haunt" },
  { word: "banshee", intensity: "vivid", group: "banshee" },
  { word: "banshees", intensity: "vivid", group: "banshee" },
  { word: "wight", intensity: "ominous", group: "undead" },
  { word: "wights", intensity: "ominous", group: "undead" },
  { word: "ghast", intensity: "ominous", group: "ghoul" },
  { word: "ghasts", intensity: "ominous", group: "ghoul" },
  { word: "hauntedness", intensity: "ominous", group: "haunt" },
  { word: "spectrality", intensity: "vivid", group: "specter" },
  { word: "spirit", intensity: "subtle", group: "spirit" },
  { word: "spirits", intensity: "subtle", group: "spirit" },
  { word: "spiritual", intensity: "subtle", group: "spirit" },
  { word: "phantasm", intensity: "vivid", group: "phantom" },
  { word: "phantasms", intensity: "vivid", group: "phantom" },
];

function collapseRepeats(text: string): string {
  return text.replace(/(.)\1+/g, "$1");
}

function buildPattern(words: WordDef[]): RegExp {
  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);
  const pattern = sorted.map((w) => escapeRegExp(w.word)).join("|");
  return new RegExp(`\\b(${pattern})\\b`, "gi");
}

function escapeRegExp(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const DEFAULT_PATTERN = buildPattern(WORDLIST);
const WORD_MAP = new Map(WORDLIST.map((w) => [w.word.toLowerCase(), w]));

/**
 * Detect supernatural terms in a string.
 *
 * Runs detection in two passes:
 * 1. Direct match on original text (preserves positions)
 * 2. Match on repeat-collapsed text (catches ghooost, haauunted, etc.)
 */
export function detect(text: string): DetectionResult {
  const matches: Match[] = [];
  const seen = new Set<number>();

  runPattern(text, text.toLowerCase(), matches, seen);

  const collapsed = collapseRepeats(text.toLowerCase());
  if (collapsed !== text.toLowerCase()) {
    runPattern(text, collapsed, matches, seen);
  }

  return { count: matches.length, matches };
}

function runPattern(
  _originalText: string,
  searchText: string,
  matches: Match[],
  seen: Set<number>,
): void {
  DEFAULT_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = DEFAULT_PATTERN.exec(searchText)) !== null) {
    if (seen.has(match.index)) {continue;}

    const word = match[0].toLowerCase();
    const entry = WORD_MAP.get(word);
    if (!entry) {continue;}

    seen.add(match.index);
    matches.push({
      word,
      index: match.index,
      intensity: entry.intensity,
      group: entry.group,
    });
  }
}

/**
 * Create a custom detector with additional words.
 */
export function createDetector(
  extraWords?: WordDef[],
): (text: string) => DetectionResult {
  const allWords = extraWords ? [...WORDLIST, ...extraWords] : WORDLIST;
  const pattern = buildPattern(allWords);
  const wordMap = new Map(allWords.map((w) => [w.word.toLowerCase(), w]));

  return (text: string): DetectionResult => {
    const matches: Match[] = [];
    const seen = new Set<number>();

    const lower = text.toLowerCase();
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lower)) !== null) {
      if (seen.has(match.index)) {continue;}
      const word = match[0].toLowerCase();
      const entry = wordMap.get(word);
      if (!entry) {continue;}
      seen.add(match.index);
      matches.push({ word, index: match.index, intensity: entry.intensity, group: entry.group });
    }

    const collapsed = collapseRepeats(lower);
    if (collapsed !== lower) {
      pattern.lastIndex = 0;
      while ((match = pattern.exec(collapsed)) !== null) {
        if (seen.has(match.index)) {continue;}
        const word = match[0].toLowerCase();
        const entry = wordMap.get(word);
        if (!entry) {continue;}
        seen.add(match.index);
        matches.push({ word, index: match.index, intensity: entry.intensity, group: entry.group });
      }
    }

    return { count: matches.length, matches };
  };
}

export type { WordDef as WordEntry };
