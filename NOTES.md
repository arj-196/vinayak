# Working notes

## The learner

- **Vinayak** — Arjun's brother. Arjun is the one commissioning this; Vinayak is the student.
- Strong at Claude in chat already. Do not re-teach prompting.
- Domain: knowledge work / ops.

## Teaching preferences (from Arjun, 2026-09-07)

- **Low reading tolerance.** Hard ceiling: one screen of reading per lesson, then practice.
  If a lesson needs more explanation than that, the lesson is scoped too big — split it.
- **Learns by doing.** Every lesson must end with an artifact he made himself that works.
  No lesson may be pure reading.
- **Assume zero coding comfort.** Explicit instruction from Arjun: *"don't assume him to be
  comfortable with anything coding related. There should be material explaining and making
  him comfortable with them as well."*
  Therefore: terminal, file paths, folders, Markdown, YAML frontmatter and git each get their
  own gentle on-ramp *inside* the lesson that first needs them. Never a prerequisite, never
  a link to external docs to "go learn first".
- Semi-technical is the **goal state**, not the entry requirement.

## Design decisions

- **Intake before lessons 2+.** Arjun asked for a shareable artifact so Vinayak self-reports
  access, comfort and real tasks. Lesson 1 is deliberately access-independent (Skills work on
  Free and up) so he can start before intake comes back.
- **Intake artifact carries no runtime capabilities, by design.** Declaring `db` would have
  auto-saved his answers, but a db-declaring artifact is organization-internal and cannot be
  shared publicly — if Vinayak is not in Arjun's Anthropic org he could not even open it.
  So the artifact uses `localStorage` for draft-resume and ends with a copy-paste block.
  **Confirmed 2026-09-07: Vinayak is NOT in Arjun's organisation.** So the no-capability
  decision was the correct one — a `db` artifact would have been unopenable for him.
- **Two delivery routes for the intake, because org plan may block the artifact link.**
  Anthropic's help centre states Team/Enterprise artifacts are organisation-only and cannot be
  published publicly; Free/Pro/Max can publish a link anyone can open without an account.
  Arjun's account is on a work domain, so the artifact link may not reach Vinayak at all.
  Therefore `Claude-Setup-Check.html` at the workspace root is a self-contained copy that
  works as an emailed/messaged file with no account and no org — generated from
  `assets/intake.html` by `assets/make-standalone.sh`.
  **Re-run that script after every edit to `assets/intake.html`, or the two drift.**
- **Every closed question has an open "other" line** (added at Arjun's request). Typed text
  counts as a real answer: on single-choice it overrides a clicked option, on multi-select it
  is appended and tagged `[his words]` in the output. Rationale: a forced-choice answer from a
  list that doesn't fit him is worse than no answer, because it silently miscalibrates a lesson.
- Lessons are grounded in **his** tasks, never toy examples. Until intake returns, lesson 1
  uses a task he chooses himself, so it is still his.

## Intake answered 2026-09-07 — see LR-0003, LR-0004

Settled: Pro plan (Cowork available and already visible to him), desktop app + phone only,
Microsoft 365 throughout, Skills at zero, under 30 min/week.

**Still open — the one thing to chase:**
- The recurring task to automate was left blank. L01 step 1 makes him choose one anyway, and
  L01 now asks him to report back which he picked. Capture it here when it arrives; L08 and the
  finish line are built on it.

**Confirmation still owed:** the revised MISSION.md is my reading of one sentence he wrote about
"master processes which can be transferred and implemented". He has not confirmed it. Do not
build past L04 on that interpretation without a yes.

## Risks logged

- **Microsoft 365 connector may be blocked.** It requires a Microsoft Entra business tenant —
  personal @outlook.com/@hotmail.com accounts cannot connect — and if his tenant is his
  employer's, their IT may need to approve the app. On Pro there is no Claude-side org gate, but
  the Microsoft side is outside our control. L05 must therefore ship with a no-connector
  fallback (work on OneDrive-synced local folders, or upload files directly) so the stage cannot
  dead-end. Source: https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector
- **Cowork burns usage faster than chat.** Worth telling him before L07 rather than after he
  wonders where his Pro allowance went.

## Component library

- `assets/course.css` — shared stylesheet, all lessons and reference sheets link it.
  Components: `.sheet .row .mark`, `.do .aside .onramp .warn .ask`, `.chips/.chip`, `.hint`,
  `ol.steps`, `ul.plain`, `.check/.q/.opt/.why`, `.panel`, print rules.
- **Gotcha, fixed 2026-09-07:** `ul.plain > li` and `ol.steps > li` used CSS grid for their
  markers. A grid `li` promotes *every* child to a grid item — bare text nodes included — so a
  list item mixing text with inline elements (`1 · <a>…</a> — Anthropic`) got torn across cells
  and the link was crushed into the 1.1rem marker column. Both now use `position:absolute`
  markers with `padding-left`, which leaves content flowing as normal inline text however it is
  authored. **Do not reintroduce grid on a list item** unless every child is a single block
  element.
- **Procedure lives in [CLAUDE.md](CLAUDE.md)** — definition of done for a lesson, the two
  audits, the preview-pane scripting trap, and the README-index rule. Single source of truth;
  don't restate it here.
- `assets/budget.js` — B2's calculator. Takes before/after session and weekly percentages and
  reports runs-per-session, runs-per-week, and **which clock binds first** — that last line is the
  non-obvious payload and the reason the widget exists rather than a worked example.
- `assets/meter.js` — usage-reading recorder for Track B. Readings persist in `localStorage`
  under `claude-usage-readings-v1`, so dropping `<div class="meter" data-label="…">` into a
  later lesson shows every earlier reading beside the new one automatically. **B2 depends on
  B1 having been saved** — that cross-lesson comparison is the point of the component.
- `assets/quiz.js` — retrieval-practice widget. One attempt, immediate feedback, correct answer
  always revealed. Extracted from L01 when L02 needed it; both now link it.
- `assets/intake.html` — artifact source. `assets/make-standalone.sh` regenerates the sendable
  `Claude-Setup-Check.html` from it. **Re-run after every intake edit.**
