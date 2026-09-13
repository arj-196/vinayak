# Target architecture

Proposed 2026-09-13, revised the same day for the real constraints of Vinayak's tool.

## Constraints the design must respect

Vinayak runs this in his employer's internal AI, which is a chat box and nothing more:

- It **cannot read a file system.** It sees only what is uploaded or typed into the chat.
- It **can produce a file** for download, which he then handles by hand, for example by
  importing it into Excel. If a given tool cannot, it can print the same content as text.
- **A chat has no access to any other chat.** Nothing carries over unless he carries it.

So everything the model needs arrives in the chat by Vinayak's hand, and everything it produces
leaves the same way. The design has to make that hand-carrying small, mechanical, and safe to get
wrong.

One principle still drives every choice: **the model never holds more than one document, and the
state lives somewhere that cannot be summarised away.** That place is an Excel workbook.

## The shape

```
 Stage 1 · Extract                      Stage 2 · Ledger                    Stage 3 · Narrate
 (one fresh chat per PDF)               (Excel workbook)                    (one fresh chat per project)

 he types:  project | vendor | type      Lines     ◄── import each CSV       he pastes: Tracker + Detail
 he uploads: one PDF                     Mapping   ◄── he adds a row          rows for ONE project
 he pastes: the Mapping sheet            Docs      = formulas                       │
        │                                Tracker   = formulas                       ▼
        ▼                                Detail    = formulas                plain-language notes,
 model returns: one CSV file             Review    = formulas                criterion mapping,
 he saves it to  csv/                                                        human-review list
```

The model appears twice, each time in a fresh chat with a tiny input. Excel does everything that
has to be remembered, compared, summed, or flagged.

## Stage 1 · Extract, one chat per document

**Setup, once.** The extraction instruction goes into the tool's custom or system instructions,
if it has them. If it does not, he keeps the instruction as a text file and pastes it as the
first message. Either way it is about two pages: the four category definitions, the mapping
principles, the output columns, the copying rules, and "if a label matches nothing, mark it
UNMAPPED and do not guess". The text is [prompts/stage1-extract.md](prompts/stage1-extract.md).

**Per document, six actions:**

1. Open a **new chat**. Never reuse one. This is the whole fix in one habit.
2. Type one header line: `Project: <name> | Vendor: <name> | Type: quote` (or `invoice`). This
   is the only way the model learns which project and vendor the document belongs to. Do not rely
   on the tool passing the file name through; some do, some do not.
3. Upload **one PDF**.
4. Paste the **Mapping sheet** from Excel: select the range, copy, paste. Excel pastes as
   tab-separated text, which the model reads without trouble. This is how the growing label
   table crosses the chat boundary, since no chat can see the last one.
5. Download the **CSV** the model returns. If the tool cannot produce a file, the same CSV
   arrives as a code block; copy it into a new text file and save it with a `.csv` name.
6. Save it into the `csv/` folder next to the workbook. The model names it
   `<project>__<vendor>__<type>__<doc_id>.csv`; keep that name.

**What the CSV contains.** One file per document, one row per item, in a fixed column order. A
`row_kind` column lets three kinds of row share one file so there is only one thing to import:

| `row_kind` | One row per | Key columns |
|---|---|---|
| `line` | Line item on the document | `label_as_printed`, `description`, `qty`, `unit_amount`, `amount`, `category`, `confidence`, `note`, `page`, `line_no` |
| `total` | Total the document itself prints, by category | `category`, `amount`, `page` |
| `coverage` | Document | `pages_total`, `pages_read`, `native_or_scan`, `mapping_provided` |

Every row also carries `project`, `vendor`, `doc_type`, `doc_id`, `doc_date`, `ref_quote_id`
(for invoice lines, the quote they bill against), and `source_file`. Amounts are copied as printed, never
computed by the model.

**Context per chat:** one PDF at roughly 2,300 tokens per page, an instruction under 1,500
tokens, a mapping table under 1,000. The next document is a new chat, so accumulation is not
unlikely, it is impossible.

**Rules kept from the current prompt:** the four categories; installation as a sub-line inside
the labour total rather than an addition to it; tax and surcharges excluded; design and
project-management fees counted as labour but not installation; never guess an unmapped label.

**Rules dropped, and what replaces them:**

| Dropped | Replaced by |
|---|---|
| Trigger phrases and the project state machine | The header line, and one chat per document |
| "One project at a time, no carryover" and "clear the log" | A chat sees one document. There is nothing to carry over. |
| The rule forbidding untraceable figures | `source_file`, `page`, `line_no` on every row. Traceability is a column he can see is empty, not a behaviour to police. |
| The two-tier comparison logic | Excel formulas |
| The arithmetic self-check | Excel formula: extracted lines against the `total` rows |
| Per-batch intake restatement and content check | The `coverage` row, and the `Docs` sheet built from it |
| Vendor-specific format notes | Rows in the `Mapping` sheet |

## Stage 2 · Ledger, the workbook does the work

One workbook per audit. This *is* the working log the current prompt pretends the chat has.

| Sheet | Contents | Filled by |
|---|---|---|
| `Lines` | Every row from every CSV, appended | Import (below) |
| `Mapping` | `label_as_printed` → category, with the vendor it was seen on. The table the prompt says to "build up as you go", now as data he pastes into each Stage 1 chat | Vinayak, when an `UNMAPPED` row appears in `Review` |
| `Docs` | One row per document, derived from the `coverage` and `total` rows: pages read, native or scan, stated totals by category | Formulas over `Lines` |
| `Tracker` | One row per project-and-vendor. Quoted and invoiced by category via `SUMIFS` on `Lines`; variance and percentage by subtraction and division; `Discrepancy` by comparing variance to a tolerance; `Pending` when a quote has no invoice in `Docs` | Formulas |
| `Detail` | Quote lines with no matching invoice line, invoice lines with no matching quote line, and lines in both at different amounts. Match on `ref_quote_id` first, normalised description second | Formulas |
| `Review` | Union of: `confidence = L`; `category = UNMAPPED`; documents whose extracted lines do not sum to their `total` row; documents with pages unread; any `doc_id` appearing in more than one CSV | Formulas |

**Getting the CSVs in, two options.**

- **Paste.** Open the CSV, copy the rows, paste under the last row of `Lines`. Fine for the pilot.
- **Power Query from folder.** This is Excel on his own machine, not the AI tool. Excel for
  Microsoft 365 can point a query at the `csv/` folder where he saves the downloads,
  combine every file in it, and load the result into `Lines`. After that, adding a document is:
  save the CSV, press Refresh All. No paste, no wrong-sheet mistakes, and a colleague cannot get
  it wrong either. Set this up once the pilot has settled the columns.

What the workbook buys:

- **Arithmetic is exact.** A `SUMIFS` does not get tired at row thirty.
- **The sum check becomes a real audit.** Lines that do not add up to the document's own printed
  total mean the model misread something, and `Review` names the document before anyone looks at
  a variance.
- **The mapping table is data.** A new vendor label is a new row, not a prompt edit and a re-run.
- **A colleague can use it.** Excel is the tool the team already lives in.

## Stage 3 · Narrate, one chat per project, optional

Once `Tracker` and `Detail` are populated for a project, copy those rows, a few kilobytes at most,
into a fresh chat with the client's billing standards pasted alongside, and ask for the
plain-language notes column and the mapping of each discrepancy to a standard. The input is a
handful of rows, never a PDF. This is the only place the current prompt's compliance list is
still needed.

## Rollout

| Phase | What changes | When |
|---|---|---|
| **A · Paste** | Stage 1 by hand, CSVs pasted into `Lines`. Proves the design with nothing new to learn. | Now. This is the pilot in [pilot.md](pilot.md). |
| **B · Refresh** | Power Query from folder replaces the paste. Adding a document becomes save-and-refresh. | Once the pilot has fixed the columns. |
| **C · Someone else** | A colleague runs Stage 1 from the written instruction and the workbook template, without Vinayak in the room. | The course's finish line, and this project's exit criterion. |

## Model choice

Whichever models the internal tool offers, prefer the most capable current-generation one for
Stage 1, and never a flash-tier model for a task whose whole job is exact numeric extraction. If
Sonnet 5 is among them, start there: it is the current Sonnet generation. Under this design the
context window barely matters, since one chat sees one document. Settle the final choice with the
fifteen-minute test in [pilot.md](pilot.md), not with opinion.

## Failure modes this design still has

| Risk | Mitigation |
|---|---|
| Model misreads a number | `Review`: lines that do not sum to the document's own printed total |
| Model maps a label to the wrong category | Label kept verbatim in `label_as_printed`; `Mapping` makes the rule visible and correctable once |
| Model invents a line that is not on the page | `page` and `line_no` on every row make a spot check take seconds; the sum check catches most |
| He forgets to paste the mapping table | Labels come back `UNMAPPED` instead of guessed; `Review` shows them; he re-runs that one document |
| He reuses a chat for a second document | The header line names one document; the instruction says to refuse a second upload in the same chat and ask for a new one |
| Scanned PDF is illegible | `coverage` row reports pages unread; `Review` flags the document; the fix is OCR or a native export, not a re-prompt |
| Description text differs slightly between quote and invoice | Match on `ref_quote_id` first; unmatched pairs go to `Review` for a manual pair |
| The same document is extracted twice | `Review`: any `doc_id` present in more than one `source_file` |
| The tool cannot produce a downloadable file | The CSV arrives as a code block; copy into a text file. Same columns, one extra step. |
