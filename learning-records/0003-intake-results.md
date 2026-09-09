---
Status: active
---

# Intake results: Pro plan, Microsoft shop, and a file-path gap hiding under terminal experience

Vinayak's answers landed 2026-09-07 and settle the two questions that were blocking
[LR-0002](./0002-intake-pending.md).

**Access is better than assumed.** Pro plan, so Cowork is available — and he has already
confirmed he can see it in the message box. He uses the **desktop app and phone, never a
browser**, which matters because the desktop app is what permits local file access in Cowork.
Claude Code is not installed. Skills: "heard of them, never looked" — Stage 01 genuinely starts
at zero, so L01 is pitched correctly.

**The comfort ladder is non-monotonic, and that is the useful finding.** He ticked: edits `.txt`
/`.md` files, has seen Markdown, has written spreadsheet formulas, and *has typed a command into
a terminal*. He did **not** tick: "could tell me where a file lives", "renamed or moved files in
Finder/Explorer", YAML, git, or writing a script.

A learner who has used a terminal but does not claim to read a file path is unusual, and the
explanation is almost certainly his stack: he lives in **OneDrive/SharePoint, Teams, Outlook,
Excel and PowerPoint**. In that world a document's location is a Teams site or a shared link,
not a path — so "where does this file live" has genuinely never been a question he needed to
answer. He is not under-skilled here; he is skilled in a different model of storage.

**Implications.** Do not teach file paths as remedial basics — teach them as a *translation*
between the SharePoint model he already has and the folder model Cowork needs. This earns its
own lesson (L06) placed immediately before Cowork, because Cowork is pointed at folders and the
gap would otherwise surface as unexplained failure. Conversely, do **not** spend a lesson on
terminal fear: he has already typed a command, so the planned from-zero terminal lesson is
over-scoped for him. YAML still needs its on-ramp (L03).

Every connector example must be Microsoft. No Google Workspace examples anywhere.

**One answer is still missing:** the recurring task to automate was left blank. Not blocking —
L01 step 1 has him choose a task himself, which supplies it. Capture whatever he picks, because
L08 and the capstone are built on it.
