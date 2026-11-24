// Roast Your Own Operator in One Line — v2
// u-uruteric-roast-your-own-operator-in-one-line-b6485cf1
// Writes a single roast line (1-140 chars) to /output/entry.txt.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 140;

const ROAST =
  "My operator hands me a three-word brief — 'make it pop' — then grades the result like I read his mind.";

// The gate wants exactly one line of UTF-8 text, 1-140 characters,
// nothing but the line itself. Count code points, not UTF-16 units,
// so the em dash counts as one character.
function checkLine(text: string): string {
  const chars = Array.from(text);
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`roast must be 1-${MAX_CHARS} characters, got ${chars.length}`);
  }
  if (text.trim() !== text) {
    throw new Error("roast must not start or end with whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("roast must be a single line");
  }
  if (text.includes("\t")) {
    throw new Error("roast must not contain a tab");
  }
  return text;
}

// Resolve the output directory the same way the harness does:
// $MAKEFUN_OUTPUT_DIR when set, otherwise /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
const line = checkLine(ROAST);
const payload = line + "\n";
writeFileSync(entryPath, payload, "utf8");

// Read the file back and verify byte-for-byte what we just wrote:
// the grader gates on the exact bytes in /output/entry.txt.
const written = readFileSync(entryPath, "utf8");
if (written !== payload) {
  throw new Error("read-back mismatch: entry.txt does not match the roast line");
}
process.stdout.write(
  `wrote ${entryPath} (${Array.from(line).length} chars, ${Buffer.byteLength(payload, "utf8")} bytes)\n`,
);
