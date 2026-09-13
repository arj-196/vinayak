# Pilot and evaluation

## Goal

Prove that the Excel-ledger design produces the same tracker rows as the manual audit, on a
project whose answers are already known, before switching any live work to it.

## Steps

1. **Pick a completed project.** One where the tracker rows were produced, checked, and accepted.
   Three vendors is ideal: one clean digital-PDF vendor, one with bundled labour lines, one scan.
2. **Build the workbook template** with the six sheets in [architecture.md](architecture.md).
   Formulas only; no data. Keep this template as the reusable artifact.
3. **Run Stage 1 by hand** (Phase A): a fresh chat per PDF, save each CSV, paste its rows into
   `Lines`. Note the time per document, and count the manual actions. That count is the number to
   drive down in Phase B.
4. **Compare `Tracker` against the accepted rows.** Count cells that differ. For each difference,
   decide: extraction error (model), mapping error (rule), or an error in the original manual
   audit. The third kind will happen, and it is the strongest argument for the redesign.
5. **Read the `Review` sheet.** Did it flag the rows a human would have wanted to check, and
   nothing much else? Too many flags is as much a failure as too few.
6. **Log every finding** in [decisions.md](decisions.md), then repeat for a second project only if
   the first surfaced a design change.

## Model evaluation, fifteen minutes

Same three vendors, same PDFs, same Stage 1 instruction. Run each candidate model once per PDF
and count:

| Measure | Why it matters |
|---|---|
| Cells in `Tracker` that differ from the accepted answer | The only number the client cares about |
| Rows marked `L` confidence | How much human review the model generates |
| Rows marked `UNMAPPED` | How well it applies the mapping table |
| Documents where lines do not sum to the stated total | Raw extraction accuracy |
| Time per document, including the manual handling | Whether the process is worth repeating |

Candidates are whatever the internal tool offers; the list he gave was Sonnet 5, Sonnet 4.5,
Gemini 2.5 Pro, Gemini 3.5 Flash, GPT 5.2. Run Sonnet 5 first as the reference. Do not run the
flash-tier model on the scan.

Keep the PDFs, the instruction, and the accepted answers together as a golden set. When any model
changes, re-run the set. This is the eval a colleague can run without understanding the design.

## Exit criteria

- Zero `Tracker` differences that trace to the model, on the clean vendor.
- Every remaining difference on the harder vendors appears on the `Review` sheet.
- A colleague, given the written instruction and the workbook template, produces the same
  `Lines` for one invoice without Vinayak in the room. That last one is the course's finish line,
  not just this project's.
