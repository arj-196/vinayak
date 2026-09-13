---
Status: active
---

# Workspace split: `learning/` for the course, `projects/` for his real workflows

On 2026-09-13 Arjun brought a real workflow of Vinayak's — a quote-versus-invoice audit run
inside one AI chat — that was failing mid-run, and asked for the workspace to hold the analysis.
That is a different kind of material from a lesson: it is about one of his tasks rather than about
teaching him, it will accumulate as more workflows arrive, and it touches his employer's work.

**Decided.** Everything that existed moved under `learning/` with `git mv`, so history follows.
A new `projects/` holds one directory per workflow with the diagnosis, target design, pilot plan
and decision log. `CLAUDE.md` stays at the root and describes both halves.

**The published URL was preserved.** The course site is served by GitHub Pages from this
repository, so moving `index.html` would have broken the link Vinayak already has. The root
`index.html` is now a redirect to `learning/`, and every link that pointed at the old root now
points at `learning/` directly.

**What `projects/` may not contain.** The employer's original prompt, any source document, any
extracted figure, and by default any client or vendor name. Prompts we write from scratch, with
generic names, are ours and are stored. Two reasons, and either alone would be enough:
a prompt written for an employer is that employer's intellectual property, and this repository is
public because the site is served from it. The plan for a workflow is Arjun's and Vinayak's
reasoning; the workflow's own material is not.

**Why this is not a second mission.** The first project, `contract-invoice-audit`, turns out to be
the recurring task the course had been waiting for — the blank answer on his intake, chased in
[LR-0003](./0003-intake-results.md). The redesign there (one document per chat, Excel as the
working log, a written instruction a colleague can run) is a master process transferred and
implemented, and its failure mode is the Track B lesson in the wild. One honest limit: the
workflow runs in his employer's chat-only tool, so Cowork cannot be the automation layer for it,
and L08 may need a second task that lives inside Claude. `projects/` feeds the course; it does not
compete with it.
