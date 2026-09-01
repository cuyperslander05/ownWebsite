# Chat worker

The backend for the site's assistant. It exists because the site is a static
export on GitHub Pages: anything shipped to the browser is public, so the
OpenRouter API key cannot live there. This Worker holds the key, holds the
system prompt, and is the only thing the browser talks to.

## What it does

`POST /` with `{"messages":[{"role":"user","content":"..."}]}` returns
`{"reply":"..."}`.

Protections, all enforced server-side:

- **Origin allowlist** — anything not in `ALLOWED_ORIGINS` gets a 403, so the
  endpoint cannot be embedded in someone else's page and run up the bill.
- **Rate limit** — 20 messages per IP per hour, counted in KV.
- **Size caps** — at most 12 messages of 1000 characters each, and at most 400
  tokens generated per reply.
- **The system prompt lives here**, not in the browser, so a visitor cannot
  edit it and make the assistant say whatever they like.

It stores nothing. Conversations are not logged or persisted anywhere.

## One-time setup

From this `worker/` directory:

```bash
npm install

# 1. Log in to Cloudflare (opens a browser)
npx wrangler login

# 2. Create the KV namespace used for rate limiting, then paste the printed
#    id into wrangler.toml under [[kv_namespaces]].
npx wrangler kv namespace create CHAT_RATE_LIMIT

# 3. Store the OpenRouter key. It is never written to a file.
npx wrangler secret put OPENROUTER_API_KEY

# 4. Deploy
npm run deploy
```

Wrangler prints the deployed URL, something like
`https://landercodes-chat.<subdomain>.workers.dev`.

## Connecting the site to it

The site reads the endpoint from `NEXT_PUBLIC_CHAT_API_URL`. **Without it the
chat widget does not render at all**, which is the safe default — the site works
exactly as before until this is set.

For the GitHub Pages build, add it to the workflow's build step in
`.github/workflows/deploy.yml`:

```yaml
- run: npm run build
  env:
    NEXT_PUBLIC_CHAT_API_URL: https://landercodes-chat.<subdomain>.workers.dev
```

The URL is public either way — it ends up in the JavaScript bundle — which is
fine. It is the key that must stay secret, and that never leaves Cloudflare.

For local development, put it in `.env.local` at the repository root.

## Costs and keeping them bounded

The model is set in `src/index.ts`:

```ts
const MODEL = "google/gemini-2.5-flash-lite";
```

At its current price a typical question costs a small fraction of a cent. Swap
in any id from <https://openrouter.ai/models> to change model — cheaper ones
exist, but very small models are noticeably worse at obeying the "never invent
anything" rule, which is the point of the prompt.

Belt and braces: set a spending limit on the key itself in the OpenRouter
dashboard. The rate limit above bounds abuse per IP; a credit limit bounds the
total no matter what.

## Changing what the assistant knows

Everything it may say comes from the `PROFILE` constant in `src/index.ts`. It
has no other source and is instructed to decline anything not written there. If
the CV changes, edit that constant and redeploy — the site itself does not need
rebuilding.
