# Decisions

Newest first. Each entry says what was decided, why, and what it supersedes.

## 2026-09-13 · The example workbook uses INDEX/MATCH helper columns, not dynamic arrays

**Decided:** [example/audit-ledger-example.xlsx](example/audit-ledger-example.xlsx) builds
`Docs`, `Tracker`, `Detail`, and `Review` with sequence helper columns on `Lines` plus
`INDEX`/`MATCH`, instead of the `FILTER`/`UNIQUE`/`VSTACK` one-liners sketched in
[workbook.md](workbook.md). Both forms stay documented.

**Why:** the helper-column form opens in any Excel version, and it could be evaluated outside
Excel. LibreOffice is not installed on the build machine, so the file was verified by
recalculating every formula with a Python engine (`formulas`) and checking the resulting
`Tracker`, `Docs`, `Detail`, and `Review` values against the figures the sample data should
produce. Dynamic-array functions cannot be verified that way, and a file written without spill
metadata shows only the first cell of each spill.

**Three defects the verification caught before shipping:** `INSTALL` summed to zero because
the labour-grouping helper hid it; pending vendors' quote lines all appeared in `Detail` as
"quote only"; empty text cells displayed as `0` through a bare `INDEX`. All three fixes are also
written into `workbook.md`, since the 365 forms had the same first two.

**Sample data is invented.** Two vendors on one project, arranged so every sheet has something to
show. Regenerate with `example/build_workbook.py`.

## 2026-09-13 · Our own prompts are stored; the employer's original is not

**Decided:** the Stage 1 and Stage 3 prompts, the run sheet, and the workbook specification are
written from scratch in this repository and kept in `prompts/` and `workbook.md`, using only
generic names. The employer's original prompt stays out.

**Why:** Arjun's ruling. Material we author is ours; material written for his employer is theirs.
Generic names remove the last way employer or client information could leak through an example.

**Consequence for the design:** category codes are ours too (`LABOUR`, `INSTALL`, `PRODUCT`,
`ALLOWANCE`, `EXCLUDED`, `UNMAPPED`). The workbook maps them to whatever the team's tracker
calls its columns, so the prompt never has to change when the tracker does.

**Refines:** the 2026-09-13 entry below on not storing the prompt.

## 2026-09-13 · Design for a chat-only tool, and nothing more

**Decided:** the architecture assumes only three capabilities of the AI tool: a PDF can be
uploaded, a file can be returned for download or printed as text, and each chat starts blank.
No file-system access, no agent loop, no memory across chats.

**Why:** that is what Vinayak's employer's internal AI actually is. An earlier draft of
[architecture.md](architecture.md) assumed the model could read a project folder and that Cowork
could loop over it. Arjun corrected this the same day. Anything the model needs now crosses the
chat boundary by Vinayak's hand: project and vendor as a typed header line, the mapping table as
a paste from Excel, the result as a saved CSV.

**Consequence:** the automation layer is Excel, with Power Query from folder replacing the paste
once the columns are stable. Cowork is not part of this workflow.

**Supersedes:** the folder-path input and the Cowork rollout phase in the first draft.

## 2026-09-13 · State lives in Excel, not in the chat

**Decided:** the working log, the mapping table, the comparison logic, and the arithmetic move
into an Excel workbook. The model's job narrows to reading one document per chat.

**Why:** the Claude app summarises older messages when a conversation grows long, so any design
that keeps documents in the transcript will eventually lose their line items. Excel is exact at
arithmetic, is the tool the team already uses, and is the thing a colleague can be handed.
Details in [diagnosis.md](diagnosis.md).

**Supersedes:** the single-chat state machine driven by trigger phrases.

## 2026-09-13 · One document per chat

**Decided:** Stage 1 never receives more than one PDF, and never receives conversation history.

**Why:** it makes context accumulation impossible rather than unlikely. It also makes every chat
independent, which is what lets a colleague run them without any change to the instruction.

## 2026-09-13 · Traceability is a column, not a rule

**Decided:** every extracted row carries `source_file`, `page`, and `line_no`. The behavioural
rule forbidding untraceable figures is dropped from the instruction.

**Why:** a rule the model must remember to obey is weaker than a column it must fill. An empty
`page` cell is visible in Excel; a forgotten rule is not.

## 2026-09-13 · Sonnet 5 as the default, decided by a test not an opinion

**Decided:** start with Sonnet 5 if the internal tool offers it; settle the final choice with the
golden-set eval in [pilot.md](pilot.md).

**Why:** it is the current Sonnet generation, which is citable. Its accuracy relative to GPT 5.2
and Gemini 2.5 Pro on his documents is not citable, so it gets measured. Context window size
stops mattering once one chat sees one document.

## 2026-09-13 · The prompt is not stored in this repository

**Decided:** this directory holds the diagnosis, the design, the pilot plan, and these decisions.
It does not hold the prompt text, any source document, or any figure from one.

**Why:** the prompt was written for Vinayak's employer and is their intellectual property, and
this repository is public because the course site is served from it. Client and vendor names are
kept out for the same reason.
