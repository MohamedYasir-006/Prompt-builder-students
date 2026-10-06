# AGENTS.md — BotForge

BotForge helps school and college students build a copy-paste system prompt
for any AI chatbot. Template answers go through a pure `buildPrompt` function;
saved prompts live in localStorage; sharing uses URL-hash encoding.

Commands: `npm run dev`, `npm run build`, `npm run test`, `npm run lint`.

Rules:

- No AI calls or backend before Phase 7. Phases 1-6 are fully static.
- AI API key is server-side only (env vars, never in front-end or repo).
- No new dependencies without asking first.
- All templates, tones, safety rules, and explanations live in `src/data`.
- `promptBuilder` stays a pure function with unit tests.
- TypeScript strict mode, never use `any`.
- Mobile-first and accessible (labels, focus states, keyboard nav, contrast).
- All AI-vendor code lives only in `api/_lib/provider.ts`.

How to add a template (4 steps):

1. Add one file in `src/data/templates/<school|college>/my-template.ts`.
2. Register it in `src/data/templates/index.ts`.
3. Ensure it has 5-8 questions and all required `Template` fields.
4. Run `npm run test`, `npm run lint`, `npm run build` and test the builder flow.

Conventional answer keys (`buildPrompt` keys off these, see `src/lib/promptBuilder.ts`):

- `tone` — required select; option values must exist in `src/data/tones.ts`.
- `notes` — optional textarea, `maxLength: 1800` (1800 + wrapper stays
  under the 2000-char section cap, so notes are never silently truncated).
- `subject` (school) / `course` (college) — what the student studies.
- `topic` (school) / `focusTopic` (college) — the current topic or exam.
- `grade` (school) / `year` (college) / `level` — the student's level.
- Select values resolve to their option labels in the prompt, so use
  human-readable labels ("Class 8", not "class-8").
- Every `{{placeholder}}` in role/goal/rules/outputFormat/firstMessage must
  match a question id (`templates.test.ts` enforces all of the above).
- Output-format branching is data-driven: optional
  `outputFormatVariants: [{ whenAnswer, equals, format }]` on `Template`.
  `buildPrompt` uses the first variant whose answer includes `equals`,
  else the default `outputFormat`. `whenAnswer` must be a real question id
  and `equals` a valid option value (enforced by `templates.test.ts`).
  Never add template-specific imports/keys to `promptBuilder`.
- Builder drafts live in sessionStorage per template and are cleared after
  reaching `/result`.
