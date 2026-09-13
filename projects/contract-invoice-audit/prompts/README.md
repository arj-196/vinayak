# Prompts and run sheet

Written 2026-09-13. These prompts were authored here, from scratch, with generic names. They are
ours to store. The employer's original prompt is not stored anywhere in this repository.

| File | Used when |
|---|---|
| [stage1-extract.md](stage1-extract.md) | Once per document, in a fresh chat |
| [stage3-narrate.md](stage3-narrate.md) | Once per project, in a fresh chat, after the workbook is filled |
| [../workbook.md](../workbook.md) | The Excel side both prompts feed |

## Setting up, once

1. Put `stage1-extract.md` (everything below its horizontal rule) into the tool's custom or
   system instructions. If the tool has none, keep it as a text file to paste first.
2. Build the workbook from [../workbook.md](../workbook.md). Save it in a folder with an empty
   `csv/` sub-folder beside it.
3. Fill the `Mapping` sheet with the starter rows in `workbook.md`, then let it grow.

## Per document

```
1  New chat.
2  Type:      Project: Project Alpha | Vendor: Vendor A | Type: invoice
3  Upload:    the one PDF.
4  Paste:     the Mapping sheet (select the whole used range in Excel, copy, paste into the chat).
5  Download:  the CSV. If it came as a code block, copy it into a new text file and save as .csv.
6  Save to:   csv/  next to the workbook.
```

Then read the four-line summary. `UNMAPPED` above zero means a new `Mapping` row is needed and
that one document is re-run after adding it. `Pages not read` other than none means the PDF needs
a native export or OCR, not another prompt.

## Per project, after all documents are in

```
1  In Excel: Data → Refresh All (Phase B), or paste the new CSV rows under Lines (Phase A).
2  Read Review. Fix Mapping rows, re-run flagged documents, refresh again.
3  Optional: new chat, paste stage3-narrate.md if needed, then the header, Tracker, Detail and
   Review rows for this project, and the billing standards. Paste the two CSV blocks back into
   the workbook's Notes sheets.
```

## Habits that make it work

- **A new chat every document.** Reusing one is the only way to bring the old failure back.
- **Never ask the model to compare, sum, or remember.** If a question needs two documents, it is
  an Excel question.
- **The mapping table lives in Excel.** The chat only ever sees a pasted copy.
