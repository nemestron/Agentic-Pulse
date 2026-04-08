```markdown
# Agentic Pulse

An AI-powered news curation and publishing platform that collects tech/AI news, processes articles through a multi-agent LangGraph pipeline, and publishes curated content to Telegram with human-in-the-loop approval workflow.

## Live Links

- Application: https://agentic-pulse.vercel.app/
- Telegram Channel: https://t.me/agenticpulsenews

Join the Telegram channel to receive AI-curated news articles published by Agentic Pulse.

## Tech Stack

### Frontend
- Next.js 14 App Router
- TypeScript 5
- Tailwind CSS 3
- Shadcn UI
- Tremor (charts)

### Backend
- Next.js Route Handlers
- NextAuth.js v5 (Credentials provider)
- Prisma ORM 5
- bcryptjs

### Database
- Neon PostgreSQL (free tier)

### AI Layer
- LangGraph
- LangChain
- Groq API (Llama 3 70B/8B)
- LangSmith (full tracing)

### Integrations
- NewsAPI.org
- Telegram Bot API
- Native Fetch API only (no Axios)

### Testing
- Vitest
- React Testing Library
- Playwright E2E
- Husky pre-commit hooks

### Deployment
- Vercel (free tier)
- UptimeRobot monitoring

## Features

- Email/password authentication with secure password hashing
- News collection from NewsAPI.org with rate limiting and deduplication
- Multi-node LangGraph agent pipeline for scoring, summarizing, and tagging articles
- Human-in-the-loop publishing workflow with approval/rejection controls
- Telegram channel integration for automated article publishing
- Public article pages with Open Graph metadata for social sharing
- Share functionality for WhatsApp, Telegram, X, Facebook, and LinkedIn
- Analytics dashboard with KPI cards, run history charts, and source breakdowns
- Real-time data refresh with SWR polling
- Full LangSmith tracing for every agent run
- Light and dark themes with premium color palette (no blue or purple)
- Comprehensive test coverage with unit, integration, and E2E tests

## Architecture Overview

1. News Collection: Native fetch requests to NewsAPI.org, normalized and stored in Neon PostgreSQL
2. AI Processing: LangGraph pipeline with Llama 3 70B for scoring and Llama 3 8B for summarization
3. Publish Queue: Human review interface with edit, approve, and reject actions
4. Output: Approved articles published to Telegram channel with formatted messages
5. Public Sharing: Each published article has a public URL with SEO metadata for social platforms
6. Analytics: Dashboard displays metrics on collection volume, agent performance, and source distribution

## Getting Started

### Prerequisites
- Node.js 20.x LTS
- pnpm package manager
- Git
- Windows 11 or compatible environment

### Installation

1. Clone the repository
```bash
git clone https://github.com/nemestron/Agentic-Pulse.git
cd Agentic-Pulse
```

2. Install dependencies
```bash
pnpm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Configure environment variables (see below)

5. Initialize database
```bash
pnpm prisma migrate dev
```

6. Start development server
```bash
pnpm dev
```

7. Open http://localhost:3000 in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
NEWS_API_KEY=your_newsapi_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_channel_id
GROQ_API_KEY=your_groq_key
LANGSMITH_API_KEY=your_langsmith_key
LANGSMITH_PROJECT=agentic-pulse-dev
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_key
LANGCHAIN_PROJECT=agentic-pulse-dev
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run unit tests with Vitest
pnpm test:e2e     # Run E2E tests with Playwright
pnpm lint         # Run ESLint
pnpm tsc --noEmit # Type check with TypeScript
```

## Testing

- Unit tests: `pnpm test --run`
- E2E tests: `pnpm exec playwright test`
- Pre-commit hooks run lint, type check, and tests automatically

## Deployment

1. Push code to GitHub main branch
2. Connect repository to Vercel
3. Add production environment variables in Vercel dashboard
4. Vercel automatically builds and deploys on push

Production database should use a separate Neon branch. Production LangSmith project should be configured separately from development.

## Monitoring

- UptimeRobot: Monitors production endpoint every 5 minutes
- LangSmith: Full tracing for all agent runs in production project
- Vercel: Build logs and deployment status

## Author

Built by Dhiraj Malwade

- GitHub: https://github.com/nemestron
- LinkedIn: https://linkedin.com/in/dhiraj-malwade-6a8385399

