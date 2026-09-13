# Projects

Vinayak's real workflows, one directory each. This is where optimisation work and brainstorming
on those workflows is organised so that a decision, once reasoned through, is not re-argued from
scratch the next time it comes up.

## What goes in a project directory

| File | Purpose |
|---|---|
| `README.md` | What the workflow is for, its current status, and an index of the other files |
| `diagnosis.md` | What is going wrong and why, with evidence |
| `architecture.md` | The target design, and what it replaces |
| `pilot.md` | How to prove the design works before switching over, and how to measure it |
| `decisions.md` | Dated log of choices made and the reasoning, newest first |

Not every project needs every file. Add one when there is something to put in it.

## What never goes in here

This repository is public, because the course website is served from it. So:

- **Never a prompt Vinayak wrote for an employer.** It is that employer's intellectual property.
  Describe its shape and its problems; do not reproduce its text. Prompts authored in this
  repository from scratch are ours and may be stored, with generic names only: "Project Alpha",
  "Vendor A", "the client".
- **Never source documents or the figures extracted from them.** Contracts, invoices, quotes, and
  the numbers in them stay with their owner.
- **Keep client and vendor names out** unless Arjun has said a name is fine to use. Say "the
  client" and "vendor A".

If a plan cannot be explained without one of those, the plan belongs in a private channel, and this
directory holds only a pointer to it.

## Projects

| Project | Status | One line |
|---|---|---|
| [contract-invoice-audit](contract-invoice-audit/README.md) | Prompts drafted 2026-09-13, pilot pending | Quote-versus-invoice audit that loses its documents mid-run. Fix: one document per chat, Excel as the working log. |
