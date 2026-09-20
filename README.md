# Meet AI

An AI-powered video meeting platform built with Next.js. Users schedule meetings with configurable AI agents, join them over real-time video, and afterwards get an automatic transcript, summary, and a chat interface to ask questions about what was discussed.

## Features

- **Auth** — email/password and Google/GitHub OAuth via [better-auth](https://better-auth.com)
- **Agents** — create reusable AI agents (name, personality/instructions) to invite into meetings
- **Meetings** — schedule, join, and manage meetings with an agent
- **Video calls** — real-time video powered by [Stream Video](https://getstream.io/video/), with an in-call AI participant
- **Background processing** — after a call ends, [Inngest](https://www.inngest.com/) fetches the transcript, attaches speaker info, and generates an AI summary with OpenAI
- **Post-meeting chat** — ask questions about a completed meeting's transcript via Stream Chat + an OpenAI-backed agent
- **Billing** — subscription/upgrade flow via [Polar](https://polar.sh/)

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Drizzle ORM](https://orm.drizzle.team/) + Postgres ([Neon](https://neon.tech))
- [tRPC](https://trpc.io/) for the typed API layer
- [better-auth](https://better-auth.com) for authentication
- [Stream Video](https://getstream.io/video/) and [Stream Chat](https://getstream.io/chat/) SDKs
- [Inngest](https://www.inngest.com/) for background jobs
- [OpenAI](https://platform.openai.com/) for summarization and agent replies
- [Polar](https://polar.sh/) for payments
- Tailwind CSS + shadcn/ui (Radix primitives) for the UI

## Project structure

```
src/
  app/                  # Next.js routes (App Router)
    (auth)/             # sign-in / sign-up
    (dashboard)/        # agents, meetings, upgrade
    call/[meetingId]/   # video call room
    api/                # auth, tRPC, inngest, Stream webhook handlers
  modules/              # feature modules (agents, meetings, call, auth, dashboard)
    <feature>/
      server/           # tRPC procedures
      ui/               # views and components
  db/                   # Drizzle schema and client
  inngest/              # background functions (transcript processing, chat agent)
  lib/                  # auth, stream, polar clients and shared utilities
  trpc/                 # tRPC client/server setup
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

You'll need accounts/keys for:
- A Postgres database (e.g. [Neon](https://neon.tech)) → `DATABASE_URL`
- [GitHub OAuth App](https://github.com/settings/developers) and [Google OAuth Client](https://console.cloud.google.com/) → callback URLs must be `{BETTER_AUTH_URL}/api/auth/callback/github` and `.../google`
- [Stream](https://getstream.io/) → video + chat API keys/secrets
- [OpenAI](https://platform.openai.com/) → API key
- [Polar](https://polar.sh/) → access token

> **Note:** `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must match the domain the app is actually running on (`localhost:3000` locally, your real domain in production). A mismatch is the most common cause of `redirect_uri_mismatch` errors from Google/GitHub.

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run background jobs (Inngest)

In a separate terminal:

```bash
npx inngest-cli@latest dev
```

### 6. (Optional) Expose webhooks locally

Stream's webhook (call/recording events) needs a public URL when developing locally:

```bash
npm run dev:webhook
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push the Drizzle schema to the database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run dev:webhook` | Tunnel a public URL to localhost via ngrok, for Stream webhooks |

## Deployment

Deploy to any Node.js host that supports Next.js (e.g. [Vercel](https://vercel.com)). Make sure every variable in `.env.example` is set in the deployment environment, and that `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` point at the deployed domain — then update the OAuth apps' callback URLs to match before testing sign-in.
