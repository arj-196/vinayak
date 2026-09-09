# Mission: Portable master processes with Claude

> **Status: revised 2026-09-07 from Vinayak's intake answers.** Supersedes the provisional
> mission written from Arjun's brief. **Awaiting Vinayak's confirmation** — the "Why" below is
> an interpretation of his own words and he should get to correct it.

## Why

Vinayak produces deliverables — decks, spreadsheets, reports — inside Microsoft 365, and he is
already good at writing prompts to get them. What he wants next is not better prompts. He wants
the *processes* behind those deliverables to stop living in his head: written down once as master
definitions, handed to other people, and actually executed rather than re-driven by him each time.

In his words:

> "Able to communicate to all models, develop master processes which can be transferred and
> implemented where the code can work."

Three demands are packed in there, and the journey addresses each: **transferable** (a Skill is a
plain text file another person can be given), **implemented** (Cowork executes it, not just
advises), and **all models** (see the honesty note below).

## Success looks like

- Three or more Skills of his own that fire without him naming them.
- **At least one Skill handed to a colleague who then gets his quality of output without his
  explanation.** This is the real test of "transferable" and the centre of the mission.
- A recurring deliverable produced end-to-end by Cowork while he does something else.
- He can say where a given file actually lives — this laptop vs OneDrive vs a SharePoint site —
  and point Claude at it without guessing.
- He can open a `SKILL.md`, read it, and explain to someone why it is portable.
- **He knows his own reset times and checks the clock before starting a long Cowork run** —
  so hitting a limit becomes a thing he planned around, not a thing that ambushed him.

## Constraints

- **Under 30 minutes a week.** Hard ceiling, and the single biggest design constraint. Lessons
  must be ≤15 minutes so one fits a week with room to spare. A 15-lesson journey does not fit;
  it was compressed to 9 core lessons.
- **Pro plan.** Cowork is available and he has already seen it in the message box.
- **Desktop app and phone only** — he does not use Claude in a browser. Desktop app is good news:
  it is what allows local file access in Cowork.
- **Microsoft 365 throughout**: Outlook, Teams, Excel, PowerPoint, OneDrive/SharePoint. Every
  connector example must be Microsoft, never Google.
- **Not a coder, with one surprise.** He has typed a command into a terminal and edits `.md`
  files, but does *not* claim to read file paths, and does not know YAML. See
  [LR-0003](./learning-records/0003-intake-results.md) — the file-path gap is the one to take
  seriously, because it sits directly in front of Cowork.
- Practice-first. One screen of reading, then hands on keys.
- **Usage is a real constraint, not a footnote.** Pro runs two clocks — a session limit that
  resets every five hours and a weekly limit — and Cowork consumes usage far faster than chat.
  A master process that dies halfway through because the session ran out is not implemented.
  Added as **Track B** on 2026-09-09 at Arjun's request; see
  [LR-0005](./learning-records/0005-usage-track-added.md).

## Honesty note on "all models"

Skills are Anthropic's format, not an industry standard — a Skill will not drop into another
vendor's product. What *is* portable is the thing underneath: a written-down process in plain
Markdown, which transfers between Claude surfaces (app, Cowork, Claude Code, API) and can be
re-used by hand anywhere else. L03 makes this explicit rather than letting him discover it later
and feel misled.

## Out of scope

- **Claude Code and the terminal — parked, not cancelled.** He was offered "comfortable in the
  terminal" as a win and chose to write his own answer instead, so it is not what he is chasing.
  At 30 min/week it would cost roughly two months better spent on Skills and Cowork. Kept
  available as an optional Stage 04 the moment he asks.
- The Agent SDK, the API, tokens, pricing, model selection.
- Building MCP servers. Using connectors is core; building them is not.
- Prompt engineering as a subject. He is already strong at it, and it is the thing he is trying
  to move *beyond*.
