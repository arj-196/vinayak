# Working in this teaching workspace

A `/teach` workspace. One learner (Vinayak), one mission, twelve lessons across a main path and
Track B. Read [MISSION.md](MISSION.md) before writing anything a learner will see;
[NOTES.md](NOTES.md) holds his teaching preferences and the component inventory.

## Three indexes list every lesson

A lesson the learner cannot find does not exist. Three files list them, and all three go stale the
moment a lesson is written and not added:

| File | What it is |
|---|---|
| `README.md` | The repo front door, read on GitHub |
| `index.html` | The published course home, read in a browser |
| `reference/journey-map.html` | The plan, showing order and what is ready |

**Every new lesson is added to all three in the same change that creates the lesson file.** Not
afterwards, not in a follow-up.

Link only lessons that are actually written — that is how the learner tells ready from planned.
`journey-map.html` and `index.html` list unwritten lessons too, as plain unlinked text; `README.md`
lists them as rows without a link. Verify with the coverage check below.

## Definition of done for a new lesson

A lesson is finished when all six hold:

1. The file exists at `lessons/NNNN-dash-case-name.html`, numbering continuing from the highest
   existing file.
2. **All three indexes link it** — `README.md`, `index.html`, `reference/journey-map.html` —
   each with its minute count and its "what you walk away with". Counts and any "ready now"
   tallies on those pages are updated to match.
3. Its neighbours link to it: the previous lesson's *Next* block, and any reference card that
   compresses it.
4. Lesson-count claims in prose still read true. Grep for the spelled-out number
   (`twelve`, `nine`) — these hide in meta descriptions and standfirsts.
5. Both audits below pass.
6. It links a primary source, carries citations for factual claims, and ends with the reminder to
   ask the teacher questions.

## Two audits, before calling anything done

**Torn layout.** In the browser console, find every grid/flex container whose children mix a bare
text node with an element — that is the condition that tears content across tracks and produced a
real bug on 2026-09-07. Expect zero:

```js
[...document.querySelectorAll("*")].filter(el => {
  const d = getComputedStyle(el).display;
  if (!["grid","flex","inline-grid","inline-flex"].includes(d)) return false;
  const kids = [...el.childNodes];
  return kids.some(n => n.nodeType === 3 && n.textContent.trim()) && kids.some(n => n.nodeType === 1);
}).map(el => el.className);
```

Give a list item's marker `position:absolute` with `padding-left` on the item. A list item laid
out as a grid promotes every child — text nodes included — to its own cell.

**Index coverage.** Every lesson on disk appears in all three indexes:

```bash
for f in lessons/*.html; do b=$(basename "$f")
  for idx in README.md index.html reference/journey-map.html; do
    grep -q "$b" "$idx" || echo "MISSING from $idx: $b"; done; done
```

**Links.** Every relative `href` resolves from the file's own directory. Run it from the repo
root; `CLAUDE.md` reports false hits on the snippets quoted in this file, which is expected:

```bash
for f in lessons/*.html reference/*.html index.html README.md; do d=$(dirname "$f")
  grep -o 'href="[^"#]*"' "$f" | sed 's/href="//;s/"//' | grep -v '^https\?://' | sort -u |
  while read l; do [ -e "$d/$l" ] || echo "DEAD $f -> $l"; done; done
```

## Testing pages that use scripts

The preview pane serves local files as a `data:` URL, so relative `<script src>` never resolves
and every shared script silently no-ops. A widget that looks dead there is usually fine. Test over
HTTP instead:

```bash
python3 -m http.server 8765
```

then open `http://localhost:8765/lessons/<file>.html` in a **new** tab (a tab pinned to a local
file preview refuses to navigate).

## Standing rules

- **Build from `assets/`.** Read it before authoring; a second lesson needing the same thing means
  extracting a component, not copying code. `course.css` carries every shared class.
- **Regenerate the sendable intake** after editing `assets/intake.html`:
  `sh assets/make-standalone.sh`. The published artifact and `Claude-Setup-Check.html` drift
  otherwise.
- **Quiz answers stay the same word count**, and as close to the same character count as the
  wording allows, so answer shape gives nothing away.
- **Cite claims about how Claude behaves.** Prefer Anthropic's own docs. Where the docs are silent,
  say so in the lesson and teach the learner to observe the real value instead of asserting a
  mechanic — see B1 on when a five-hour session starts.
- **Write a learning record** when a decision would otherwise be re-litigated later, and mark the
  record it supersedes.
