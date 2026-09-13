# Contract vs invoice audit

**Owner:** Vinayak. **Status:** redesign and prompts drafted 2026-09-13, not yet piloted.

## What the workflow does

For a procurement project, compare each vendor's quote against the invoices later raised for it,
across four cost categories, and produce two things a spreadsheet tracker expects: one summary row
per project-and-vendor with quoted, invoiced, and variance figures, and one detail row per line
item that differs. The client's underlying worry is that fixed-rate labour was quoted and
time-and-materials labour was billed.

Today the whole workflow runs inside one AI chat. A long system prompt turns the chat into a state
machine driven by trigger phrases: open a project, log quote batches, log invoice batches, run the
comparison, close the project. The prompt is not stored here (see [../README.md](../README.md)
for why); the analysis below refers to it by shape.

## The problem, in one paragraph

It works for the first several documents and then starts saying it cannot read documents that were
pasted earlier, so the run has to be restarted from nothing. The cause is not the model or the
prompt length. It is that the conversation transcript is being used as the database, and the
Claude app summarises older messages once a conversation gets long. A summarised invoice keeps its
gist and loses its line items. Full reasoning in [diagnosis.md](diagnosis.md).

## The proposal, in one paragraph

Split the job by who is good at it. A language model, in a fresh chat each time, reads one PDF
and returns one CSV file: label, amount, category, confidence, page. Vinayak saves the file, and
an Excel workbook holds every row and does the comparing, subtracting, summing, and flagging with
formulas. The model never sees more than one document per chat, so nothing accumulates and
nothing gets summarised away. It works inside a chat-only tool that cannot read files and forgets
everything between chats, because it asks that tool for nothing more than that. Full design in
[architecture.md](architecture.md), proof plan in [pilot.md](pilot.md), choices logged in
[decisions.md](decisions.md).

## The pieces to hand over

| Piece | Where |
|---|---|
| Extraction prompt, one document per chat | [prompts/stage1-extract.md](prompts/stage1-extract.md) |
| Notes prompt, one project per chat, optional | [prompts/stage3-narrate.md](prompts/stage3-narrate.md) |
| Run sheet: setup once, six actions per document | [prompts/README.md](prompts/README.md) |
| Workbook: sheets, columns, formulas, starter mapping table | [workbook.md](workbook.md) |
| Example workbook with sample data and live formulas, plus the three CSVs that fed it | [example/](example/) |

These were written here from scratch with generic names, so they carry no employer material and
can be stored and shared. The original prompt is not in this repository.

## Why this matters for the course

This is the recurring task the course has been waiting for. It is a real, repeating,
spreadsheet-shaped deliverable. It runs in his employer's chat-only tool rather than in Claude, so
the automation layer here is Excel, not Cowork, and the transferable artifact is the thing the
course's honesty note says is actually portable: a written-down process in plain text, plus a
workbook template. Handing both to a colleague who then produces the same rows is the course's
finish line. See the open item in [learning/NOTES.md](../../learning/NOTES.md).

## Open questions for Vinayak

1. The exact wording of the failure message. "I cannot find the line items in that document" and a
   confidently wrong number need different fixes. The current prompt was tuned against the second;
   he now describes the first.
2. Are the quotes native PDFs or scans? A scan costs several times more context per page and
   needs OCR before any model reads it.
3. How many documents and pages does a typical project involve, per vendor?
4. Can the internal tool return a downloadable file, and does it have custom or system
   instructions? Both change how Stage 1 is set up, neither changes the design.
5. Which models the internal tool offers, so the pilot's model test uses the real list.
