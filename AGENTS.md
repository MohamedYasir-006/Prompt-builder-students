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
