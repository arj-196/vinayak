# The workbook

One workbook per audit. Excel for Microsoft 365, because `FILTER`, `UNIQUE`, and `VSTACK` make
the derived sheets one formula each. Sheet names below are used by the prompts and the run sheet.

**A built example lives in [example/audit-ledger-example.xlsx](example/audit-ledger-example.xlsx)**,
with generic sample data for two vendors and every formula live. It uses the equivalent
`INDEX`/`MATCH` helper-column pattern instead of `FILTER`/`UNIQUE`/`VSTACK`, so it opens in any
Excel version; the shorter 365 forms below produce the same sheets. The three CSVs in
`example/csv/` are what Stage 1 returns for those documents, and `example/build_workbook.py`
regenerates the whole thing.

## `Lines` — every row from every CSV

Columns exactly as the Stage 1 CSV, in order:

```
row_kind, project, vendor, doc_type, doc_id, doc_date, ref_quote_id, page, line_no,
label_as_printed, description, qty, unit_amount, amount, category, confidence, note,
pages_total, pages_read, native_or_scan, mapping_provided, source_file
```

Plus two helper columns on the right:

- `match_key` = `IF(doc_type="quote", doc_id, ref_quote_id) & "|" & LOWER(TRIM(description))`.
  This is what pairs a quote line with the invoice line that bills it.
- `labour_group` = `IF(OR(category="LABOUR", category="INSTALL"), "LABOUR_ALL", category)`. This
  is what lets the labour total include installation while installation is also reported alone.

**Phase A:** paste each CSV's rows under the last row. **Phase B:** Data → Get Data → From
Folder, pointed at `csv/`, Combine, load to this sheet. Adding a document becomes save the file
and Refresh All.

## `Mapping` — the label table, and the only thing pasted into every chat

```
label_as_printed, category, vendor, note
```

Starter rows, generic. Extend whenever `Review` shows an `UNMAPPED` label:

| label_as_printed | category | vendor | note |
|---|---|---|---|
| Installation | INSTALL | any | |
| Install labour | INSTALL | any | |
| Delivery & install | INSTALL | any | |
| Labour | INSTALL | any | Confirm per vendor; some print labour for design time |
| Design fee | LABOUR | any | |
| Project management | LABOUR | any | |
| Freight | LABOUR | any | |
| Allowance | ALLOWANCE | any | |
| Contingency | ALLOWANCE | any | |
| Sales tax | EXCLUDED | any | |
| Surcharge | EXCLUDED | any | |

## `Docs` — one row per document, all formulas

`doc_id` column: `=UNIQUE(FILTER(Lines[doc_id], Lines[row_kind]="coverage"))`.

For each `doc_id`, look up from its `coverage` row: `project`, `vendor`, `doc_type`, `doc_date`,
`pages_total`, `pages_read`, `native_or_scan`, `mapping_provided`, `source_file`, and for each
category `C` in `LABOUR_ALL`, `INSTALL`, `PRODUCT`, `ALLOWANCE`:

- `stated_C` = `SUMIFS(Lines[amount], Lines[doc_id], [@doc_id], Lines[row_kind], "total", <group>, "C")`
  where `<group>` is `Lines[labour_group]` for `LABOUR_ALL` and `Lines[category]` for the other
  three. Matching `INSTALL` against `labour_group` would find nothing, because the helper folds
  it into `LABOUR_ALL`. For `LABOUR_ALL` this sums the `LABOUR` and `INSTALL` totals; a document
  that prints only one labour total lands on whichever the model mapped.
- `extracted_C` = same `SUMIFS` with `row_kind` = `"line"`.
- `sum_check_C` = `IF(stated_C=0, "no stated total", IF(ABS(stated_C-extracted_C)>Tolerance, "MISMATCH", "ok"))`.

`Tolerance` is a named cell, start at `0.01`.

## `Tracker` — one row per project and vendor, all formulas

Key columns: `=UNIQUE(FILTER(CHOOSECOLS(Lines, 2, 3), Lines[row_kind]="line"))` gives the
project-and-vendor pairs.

For each category `C` in `LABOUR_ALL`, `INSTALL`, `PRODUCT`, `ALLOWANCE`:

- `quoted_C` = `SUMIFS(Lines[amount], Lines[project], [@project], Lines[vendor], [@vendor], Lines[doc_type], "quote", Lines[row_kind], "line", <group>, "C")`
  with `<group>` as in `Docs`: `labour_group` for `LABOUR_ALL`, `category` otherwise
- `invoiced_C` = same with `doc_type` = `"invoice"`
- `variance_C` = `invoiced_C - quoted_C`
- `variance_pct_C` = `IFERROR(variance_C / quoted_C, "")`

Then:

- `invoice_count` = `COUNTIFS(Docs[project], [@project], Docs[vendor], [@vendor], Docs[doc_type], "invoice")`
- `discrepancy` = `IF(invoice_count=0, "N/A - pending", IF(MAX(ABS(variance_LABOUR_ALL), ABS(variance_INSTALL), ABS(variance_PRODUCT), ABS(variance_ALLOWANCE))>Tolerance, "Y", "N"))`
- `notes` = pasted from Stage 3, or typed.

Rename the visible headers to whatever the team's existing tracker calls these columns. Only the
codes inside the formulas have to stay as they are.

## `Detail` — line differences, all formulas

Work from the `line` rows of quotes. For each quote line:

- `invoice_amount` = `SUMIFS(Lines[amount], Lines[match_key], [@match_key], Lines[doc_type], "invoice", Lines[row_kind], "line")`
- `invoice_hits` = `COUNTIFS(Lines[match_key], [@match_key], Lines[doc_type], "invoice", Lines[row_kind], "line")`
- `status` = `IF(invoice_hits=0, "quote only", IF(ABS(invoice_amount-[@amount])>Tolerance, "amount differs", "match"))`

And from the `line` rows of invoices, the mirror: `quote_hits` by `match_key` against quotes;
`status` = `"invoice only"` when zero.

`Detail` itself = `VSTACK` of two `FILTER`s: quote lines whose `status` is not `"match"`, and
invoice lines whose `status` is `"invoice only"`, both further filtered to vendors that have at
least one invoice document, so a pending vendor's quote lines do not all appear as `quote only`.
A vendor that matched exactly gets one word in `notes` and nothing here.

Wrap text lookups as `INDEX(...)&""`. A bare `INDEX` on an empty cell displays `0`.

Descriptions that differ in wording between quote and invoice will show as `quote only` and
`invoice only` pairs. That is correct behaviour: a human pairs them once, by typing the quote's
`description` into the invoice line's `description` in `Lines`, and the next refresh matches them.

## `Review` — everything a human should look at, one formula

`=VSTACK(` then, each as a `FILTER` over `Lines` or `Docs`, carrying `doc_id`, `page`,
`line_no`, and a `reason` column:

1. `Lines[confidence]="L"` → reason `low confidence`
2. `Lines[category]="UNMAPPED"` → reason `no mapping rule`
3. `Docs[sum_check_*]="MISMATCH"` → reason `lines do not sum to stated total`
4. `Docs[pages_read]<>"1-"&Docs[pages_total]` → reason `pages not read`
5. `Docs[mapping_provided]="N"` → reason `extracted without mapping table`
6. `COUNTIF(Docs[doc_id], Docs[doc_id])>1` → reason `document extracted twice`

`)`. An empty `Review` sheet is the signal that no PDF needs opening for this project.

## `Notes` — where Stage 3 output lands

Two small tables, `tracker_notes` and `detail_notes`, with the columns the Stage 3 prompt emits.
`Tracker[notes]` and a `Detail[note]` column look them up by `project`, `vendor`, `category` and
by `doc_id`, `line_no` respectively.
