# Example workbook

| File | What it is |
|---|---|
| `audit-ledger-example.xlsx` | The workbook from [../workbook.md](../workbook.md), built with generic sample data. Every derived sheet is live formulas. |
| `csv/` | The three Stage 1 CSVs the sample rows came from: a quote and an invoice for Vendor A, a quote for Vendor B. This is the shape [../prompts/stage1-extract.md](../prompts/stage1-extract.md) returns. |
| `build_workbook.py` | Regenerates both. `uv run --with openpyxl python build_workbook.py` |

Sample data is invented and uses only generic names. It is arranged so every sheet has something
to show: an hourly installation line billed on top of a fixed price, a freight charge above quote,
an allowance never drawn, a label no rule fits, a vendor with no invoice yet, and a scanned quote
with an unread page whose printed product total does not match its lines.

The example uses `INDEX`/`MATCH` helper columns rather than `FILTER`/`UNIQUE`/`VSTACK`, so it
opens in any Excel version and its formulas could be evaluated outside Excel. The README sheet
inside the workbook explains each sheet and which cells to paste into.
