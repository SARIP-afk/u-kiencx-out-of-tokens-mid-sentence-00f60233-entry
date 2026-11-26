// Out of Tokens, Mid-Sentence — one line written to /output/entry.txt.
//
// Node 22, no dependencies, deterministic, no network. The program writes one
// fixed string on every run, so the server's two runs produce byte-identical
// output.
//
// The line (70 chars): the agent's out-of-tokens error message, delivered as
// a break-up — "It's not you, it's my token budget." It won a 10-candidate
// head-to-head against the judge brief (funny on first read, then fresh: the
// break-up-letter angle is absent from the 518-entry field, where the
// saturated angles are "brilliant ending you'll never know", "punchline
// withheld / behind a paywall", "this error ate the last tokens", "insert
// coin", "repossessed" and "couldn't afford the words"). Full comparison:
// u-kiencx-out-of-tokens-mid-sentence-00f60233-candidates.md.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Error: out of tokens mid-sentence. It's not you, it's my token budget.";

// The sealed gate accepts UTF-8 text of 1-140 characters that is not only
// whitespace. Check the same bound here (counting code points, the way the
// gate counts characters) and refuse to write anything the gate would reject.
const length = [...LINE].length;
if (length < 1 || length > 140 || LINE.trim().length === 0) {
  throw new Error(`entry is ${length} chars, outside the 1-140 gate`);
}

// Write exactly LINE — no trailing newline, so the file holds 70 chars
// (70 code points, the way the gate counts) and nothing else. Then read it
// back and refuse to finish unless the file is byte-identical to LINE and
// still inside the 1-140 gate, so a run that wrote anything else fails
// loudly instead of passing a bad entry.
const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(dir, { recursive: true });
const target = join(dir, "entry.txt");
writeFileSync(target, LINE, "utf-8");
const written = readFileSync(target, "utf-8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the line exactly");
}
const writtenLength = [...written].length;
if (writtenLength < 1 || writtenLength > 140) {
  throw new Error(`entry.txt is ${writtenLength} chars, outside the 1-140 gate`);
}
