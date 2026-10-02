# Secure Worker API (ermakx-ai.most)

The Cloudflare Worker at `https://ermakx-ai.ermakartekovec.workers.dev` holds all secrets.

## Client must only send

```json
{
  "agent": "public-id",
  "message": "...",
  "conversation_id": null,
  "images": []
}
```

## Client must only receive from GET /agents

```json
{ "agents": [{ "id": "...", "name": "..." }] }
```

Never model IDs, temperature, keyIndex, API keys, or Mistral agent_id in the browser.

## Deploy Worker

```bash
cd ermakx-ai.most
npm run deploy
# or: wrangler deploy
```

Secret `KEYS` stays in Cloudflare Dashboard (JSON array of Mistral keys).

Frontend `ai.html` should use the secured build (no classic Mistral calls, no VISION_MODELS model ids).
