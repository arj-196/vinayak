# Working in this workspace

Two halves, kept apart on purpose:

| Directory | What it is |
|---|---|
| `learning/` | The `/teach` course. One learner (Vinayak), one mission, twelve lessons across a main path and Track B. Published by GitHub Pages at `https://arj-196.github.io/vinayak/learning/`; the root `index.html` only redirects there. |
| `projects/` | Improvement plans and reasoning for Vinayak's real workflows. Rules in [projects/README.md](projects/README.md). |

Read [learning/MISSION.md](learning/MISSION.md) before writing anything a learner will see;
[learning/NOTES.md](learning/NOTES.md) holds his teaching preferences and the component inventory.

## The projects directory is public

This repository serves the course website, so everything in it is public. `projects/` therefore
holds the *thinking* about a workflow, never the workflow's own material:

- **Never store a prompt Vinayak wrote for an employer.** It is their intellectual property.
  Describe its shape and its problems; do not reproduce its text. Prompts authored here from
  scratch are ours and live in the project's `prompts/`, with generic names only.
- **Never store source documents or figures extracted from them.**
- **Keep client and vendor names out** unless Arjun has explicitly said a name is fine.

## Three indexes list every lesson

A lesson the learner cannot find does not exist. Three files list them, and all three go stale the
moment a lesson is written and not added:

| File | What it is |
|---|---|
| `learning/README.md` | The course front door, read on GitHub |
| `learning/index.html` | The published course home, read in a browser |
| `learning/reference/journey-map.html` | The plan, showing order and what is ready |

**Every new lesson is added to all three in the same change that creates the lesson file.** Not
afterwards, not in a follow-up.

Link only lessons that are actually written — that is how the learner tells ready from planned.
`journey-map.html` and `index.html` list unwritten lessons too, as plain unlinked text; `README.md`
lists them as rows without a link. Verify with the coverage check below.

## Definition of done for a new lesson

A lesson is finished when all six hold:

1. The file exists at `learning/lessons/NNNN-dash-case-name.html`, numbering continuing from the
   highest existing file.
2. **All three indexes link it** — `learning/README.md`, `learning/index.html`,
   `learning/reference/journey-map.html` — each with its minute count and its "what you walk away
   with". Counts and any "ready now" tallies on those pages are updated to match.
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

**Index coverage.** Every lesson on disk appears in all three indexes. Run from `learning/`:

```bash
cd learning && for f in lessons/*.html; do b=$(basename "$f")
  for idx in README.md index.html reference/journey-map.html; do
    grep -q "$b" "$idx" || echo "MISSING from $idx: $b"; done; done
```

**Links.** Every relative `href` resolves from the file's own directory. Run from `learning/`;
the root `CLAUDE.md` is excluded because it quotes these snippets:

```bash
cd learning && for f in lessons/*.html reference/*.html index.html README.md; do d=$(dirname "$f")
  grep -o 'href="[^"#]*"' "$f" | sed 's/href="//;s/"//' | grep -v '^https\?://' | sort -u |
  while read l; do [ -e "$d/$l" ] || echo "DEAD $f -> $l"; done; done
```

## Testing pages that use scripts

The preview pane serves local files as a `data:` URL, so relative `<script src>` never resolves
and every shared script silently no-ops. A widget that looks dead there is usually fine. Test over
HTTP instead, from the repo root:

```bash
python3 -m http.server 8765
```

then open `http://localhost:8765/learning/lessons/<file>.html` in a **new** tab (a tab pinned to a
local file preview refuses to navigate).

## Standing rules

- **Build from `learning/assets/`.** Read it before authoring; a second lesson needing the same
  thing means extracting a component, not copying code. `course.css` carries every shared class.
- **Regenerate the sendable intake** after editing `learning/assets/intake.html`:
  `sh learning/assets/make-standalone.sh`. The published artifact and
  `learning/Claude-Setup-Check.html` drift otherwise.
- **Quiz answers stay the same word count**, and as close to the same character count as the
  wording allows, so answer shape gives nothing away.
- **Cite claims about how Claude behaves.** Prefer Anthropic's own docs. Where the docs are silent,
  say so in the lesson and teach the learner to observe the real value instead of asserting a
  mechanic — see B1 on when a five-hour session starts.
- **Write a learning record** (`learning/learning-records/`) when a decision would otherwise be
  re-litigated later, and mark the record it supersedes. Project-specific decisions go in that
  project's `decisions.md` instead.
