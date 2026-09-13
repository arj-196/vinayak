# Diagnosis

Written 2026-09-13 from Vinayak's description of the failure and a read of the prompt.

## The reported symptom

> It performs all functions properly at the start. Then, after some time, it behaves as if it has
> made an error and cannot remember or read the documents above, and the whole process has to be
> redone. The assistant asked for whole batches to be pasted together, and that seems to eat the
> chat's tokens in one go.

## What is actually happening

**The transcript is the database, and the app compacts the transcript.** Anthropic's help centre
states that when a conversation approaches the context window limit, Claude summarises earlier
messages to make room for new content, and that this lets conversations continue indefinitely.
[Source.](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
A summary of an invoice keeps "invoice 123 from vendor A was received" and drops the forty line
items. The model can still see that the document existed. It can no longer read the numbers in it.

**The prompt's own safety rule then fires correctly.** The prompt forbids stating any figure that
cannot be traced to an attached document. Once the document has been compacted into a summary,
that rule makes the model refuse. What reads as "it made an error" is the model honestly reporting
that its source has gone. The rule was written to stop hallucinated figures, and it is now catching
a different problem it was never designed for.

**"After some time" is message count, not time.** The model has no clock. Time correlates with how
many documents have been pasted, and document volume is what triggers the compaction.

## Where the tokens go

Not into the prompt. The system prompt is roughly 2,500 words, about 4,000 tokens. The documents
are the load. Anthropic's PDF documentation says full visual processing costs about 7,000 tokens
for a three-page PDF, because every page is processed as both text and image, and that dense PDFs
can fill the context window before reaching the page limit.
[Source.](https://platform.claude.com/docs/en/build-with-claude/pdf-support)

| Item | Approximate tokens |
|---|---|
| The whole system prompt | 4,000 |
| One two-page invoice | 5,000 |
| One forty-page quote (a size the prompt itself mentions handling) | 90,000 |
| Context window, previous-generation Sonnet, Claude app paid plan | 200,000 |
| Context window, Sonnet 5, Claude app paid plan | 1,000,000 |

Two large quotes and a handful of invoices fill a 200K window before the comparison step starts.
Halving the prompt would buy back half an invoice.

## Why the prompt looks the way it does

The prompt is a stack of patches. Each was added after a failure that the architecture guaranteed:

| Patch in the prompt | The failure it followed | The cause it did not fix |
|---|---|---|
| A rule forbidding any untraceable figure | Hallucinated numbers | Documents no longer in context |
| A per-batch "did the content actually come through" check | Header-only PDFs | Large uploads truncated |
| Vendor-specific upload advice | Merged PDFs failing to show detail | Payload too big for one turn |
| Partial-document handling | Long scans half-read | Per-page cost of scanned PDFs |
| "Permanently clear this project's working log" | Cross-project bleed | There is no log; only the transcript |

The last row is the tell. A model cannot clear a log, and cannot warn that a project with the same
name is already open, because there is no store to check. Both instructions assume the chat is a
database. It is not.

## What is genuinely the model's job here

Only one step needs a language model: reading a PDF and mapping vendor-specific labels onto the
four categories, with a confidence rating. Everything after that is deterministic once the rows
exist:

- comparing a quoted total to an invoiced total
- diffing line items between two documents that share a quote reference
- variance and percentage
- re-summing line items to check a stated total
- filtering low-confidence rows into a review list

The current prompt asks the model to do all of that in its head, over many documents, from memory.
The arithmetic self-check in particular asks a language model to re-sum forty rows without a
calculator, which it is unreliable at.

## Two things to confirm before changing anything

1. **The exact failure text.** If the model says it cannot find the earlier document, this
   diagnosis holds. If it produces a confident wrong figure, hallucination is still live and the
   traceability rule needs to survive the redesign in some form.
2. **Native PDF or scan.** The per-page cost in the table is for full visual processing. A scan
   forces that mode and adds OCR risk. A native PDF export from the vendor's system is cheaper and
   more accurate than any prompt change.
