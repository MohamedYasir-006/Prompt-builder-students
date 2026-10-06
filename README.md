# BotForge

BotForge helps school and college students build a copy-paste system prompt
for any AI chatbot (Claude, ChatGPT, Gemini, Grok, etc.).

**Phase 1 status:** foundation only — routing, layout, and empty pages.
The template builder flow arrives in Phases 2-4.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## Add a template

1. Add one file in `src/data/templates/<school|college>/my-template.ts`.
2. Register it in `src/data/templates/index.ts`.
3. Ensure it has 5-8 questions and all required `Template` fields.
4. Run `npm run test`, `npm run lint`, `npm run build` and test the builder flow.

## Deploy

Target is Vercel (static front-end + `/api` serverless functions in Phase 7+).
`vercel.json` rewrites all non-`/api` routes to `/index.html` so deep links
like `/build/course-study-buddy` work on refresh.
