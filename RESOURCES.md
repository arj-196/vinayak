# Working with Claude beyond chat — Resources

Curated for a practice-first learner with low reading tolerance. Entries are ordered
**shortest / most hands-on first** within each group. Anything long is marked so.

## Knowledge

### Start here — low text, high practice

- [Claude Academy](https://academy.claude.com) — Anthropic's own education team. Free.
  Video demos + short lessons + quizzes. `Claude 101` is 13 lessons and includes
  *Working with Skills*, *Creating with Artifacts*, and *Connecting your tools*.
  **Use for:** the gentlest possible on-ramp to any new surface. This is the primary
  source to hand him whenever a lesson introduces something new.

- [How to create a skill with Claude through conversation](https://academy.claude.com/tutorials/how-to-create-a-skill-with-claude-through-conversation) — Claude Academy tutorial.
  **Use for:** lesson 1. Shows building a Skill by *talking*, with no file editing. This is
  the single best entry point for a non-coder.

- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills) — Help Center. ~2 min.
  **Use for:** the plan/availability facts. Skills work on Free, Pro, Max, Team and Enterprise
  but require code execution enabled. Managed at **Settings → Customize → Skills**.

- [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) — Help Center. ~3 min.
  **Use for:** the Cowork stage. Confirms Cowork needs **Pro, Max, Team or Enterprise**, and
  documents the three permission modes (Manual / Auto / Skip) and where connectors live.
  Also: Cowork burns usage allocation faster than chat — worth telling him up front.

- [How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) — Help Center.
  **Use for:** the click-path for uploading a Skill in the Claude app.

### Track B — usage, limits and context

- [Usage limit best practices](https://support.claude.com/en/articles/9797557-usage-limit-best-practices) — Help Center. Short and entirely actionable.
  **Use for:** B1's primary source. Concrete levers: batch related questions into one message,
  send whole documents rather than pieces, and the big one for him —
  *"When you upload documents to a project, they're cached for future use. Every time you
  reference that content, only new/uncached portions count against your limits."*

- [How do usage and length limits work?](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work) — Help Center.
  **Use for:** the context-window mechanic that explains everything else —
  *"Longer conversations that trigger automatic context management consume more of your usage
  limit."* When a chat nears the window, Claude summarises earlier messages to continue, and the
  summarising itself costs usage. This is the single fact that makes B3 make sense.
  Also names the four cost drivers: conversation length and complexity, features used, model,
  and effort level.

- [What is the Pro plan?](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan) — Help Center.
  **Use for:** his plan's specifics. Session limit resets every five hours; a separate weekly
  limit applies across all models and resets at a fixed time assigned to his account.
  Usage visible at **Settings → Usage**, including the next reset time.

- [Manage usage credits](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans) — Help Center.
  **Use for:** what to do when blocked. Pro subscribers can enable pay-as-you-go credits at
  standard API rates with a spending cap. Mention once, in B2 — it is the escape hatch, not the
  strategy, and the strategy is the lesson.

> **Gap, stated honestly:** none of these documents says *when a five-hour session begins* —
> whether it starts at the first message, and whether sessions roll. Do not assert a mechanic
> here. B1 teaches him to read the live countdown in Settings → Usage instead, which is both
> accurate and a better habit than memorising a rule.

### Reference — reach for these, don't read them through

- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — Anthropic platform docs. **Long.** The authoritative text.
  **Use for:** description writing (third person, what + when), progressive disclosure,
  the degrees-of-freedom heuristic, and the end-of-page authoring checklist. Send him the
  checklist section only — never the whole page.

- [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — the three-level loading model and directory structure.
  **Use for:** explaining *why* a Skill costs almost nothing until it fires.

- [Extend Claude with skills — Claude Code](https://code.claude.com/docs/en/skills) — Claude Code docs.
  **Use for:** the Code stage. Exact paths (`~/.claude/skills/<name>/SKILL.md` personal,
  `.claude/skills/<name>/SKILL.md` project), the frontmatter fields Code adds
  (`allowed-tools`, `context: fork`, `disable-model-invocation`), and `/skills`,
  `/skill-doctor`. Also: Code hot-reloads skill edits, no restart.

- [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) — Anthropic PDF. **Long.**
  **Use for:** a single offline artifact if he ever wants one document to keep.

### Conceptual — one read, high leverage

- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering.
  The mental model that makes everything else click: *"Building a skill for an agent is like
  putting together an onboarding guide for a new hire."* Progressive disclosure explained as
  a manual with a table of contents, chapters, then an appendix.
  **Use for:** the one piece of theory worth his reading budget.

- [Claude Skills are awesome, maybe a bigger deal than MCP](https://simonw.substack.com/p/claude-skills-are-awesome-maybe-a) — Simon Willison.
  Independent, high-trust, sceptical-by-default practitioner. Good counterweight to
  first-party framing.
  **Use for:** perspective on *why* Skills matter, and where they don't.

## Wisdom (Communities)

- [r/ClaudeAI](https://reddit.com/r/ClaudeAI) — largest general Claude community. Mixed signal,
  but the place real workflow problems get posted.
  **Use for:** "is it just me or is X broken", and seeing how non-developers actually use Cowork.

- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) and
  [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — curated Skill collections.
  **Use for:** reading other people's real `SKILL.md` files. Reading a good Skill is the
  fastest way to learn to write one — this is the closest thing to a code-review culture here.

- [Claude Skills Hub](https://claudeskillsgithub.com/) — searchable index of skill repos.
  **Use for:** finding a Skill that already does the thing, before writing one.

> **Community status:** not yet discussed with the learner. Ask before pushing him at any of
> these — the intake artifact does not cover it. Record his answer here.

## Gaps

- **No first-party Cowork course.** Claude Academy's catalogue covers AI fluency, capabilities
  and human-agent teams, but has no Cowork course yet. The Cowork stage will have to lean on
  the Help Center article plus lessons written here.
- **No good non-developer terminal on-ramp from Anthropic.** Everything assumes a developer.
  The terminal/file-path/YAML on-ramps have to be written from scratch in this workspace —
  which is exactly why `reference/` exists.
- **Third-party Cowork tutorials are unvetted.** DataCamp, Analytics Vidhya and various
  Substacks have Cowork guides. Deliberately excluded — marketing-adjacent, and none checked
  for accuracy. Revisit only if a first-party gap becomes blocking.
