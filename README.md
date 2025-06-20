# Bitriel Digital Ecosystem

Bitriel is a comprehensive digital ecosystem app that goes beyond traditional crypto wallets. Built similar to Binance or Alipay, it offers a super-app experience with financial services, marketplace integrations, entertainment, gaming, and an extensive loyalty rewards program - all powered by cryptocurrency and Web3 technology.

## 🚀 Features

### 🏠 Dashboard & Portfolio

- Personalized home dashboard with portfolio overview
- Real-time balance tracking and performance metrics
- Quick access to essential financial functions

### 🌐 Comprehensive Ecosystem

- **Financial Services**: DeFi, staking, lending, savings
- **Marketplace**: Bill payments, shopping, travel booking
- **Entertainment**: Web3 games, NFT marketplace, streaming
- **Tools**: Mini apps, analytics, developer APIs

### 🏆 Loyalty & Rewards

- Points-based loyalty system with tier benefits
- Achievement tracking and gamification
- Cashback rewards and referral programs
- Extensive reward catalog for redemptions

### 👤 Advanced Profile Management

- Multi-wallet support with secure backup
- KYC verification and tier progression
- Comprehensive security settings
- Integrated support system

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `mobile`: React Native app with Expo (Main ecosystem app)
- `api`: Node.js backend with authentication and wallet services
- `web`: Next.js web application
- `docs`: Documentation site
- `@bitriel/wallet-sdk`: Comprehensive wallet SDK with multi-chain support
- `@repo/ui`: Shared React component library
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
yarn dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Docker Usage

This monorepo includes Docker configuration for running all services (API, Web, and Docs) in containers.

### Prerequisites

- Docker and Docker Compose installed on your system
- Node.js 18 or higher (for local development)

### Running with Docker

#### Production Mode

To run all services in production mode:

```bash
docker-compose up -d
```

This will start:

- API service on port 8000
- Web application on port 3000
- Documentation on port 3001

#### Development Mode

To run the development environment with hot-reloading:

```bash
docker-compose --profile dev up
```

This will start all services in development mode with hot-reloading enabled.

### Building Individual Services

Each service has its own Dockerfile for better maintainability:

```bash
# Build API only
docker build -f Dockerfile.api -t bitriel-api .

# Build Web app only
docker build -f Dockerfile.web -t bitriel-web .

# Build Docs only
docker build -f Dockerfile.docs -t bitriel-docs .

# Build Development environment
docker build -f Dockerfile.dev -t bitriel-dev .
```

### Environment Variables

For production deployment, make sure to set the following environment variables:

- For API: Create a `.env` file in the `apps/api` directory
- For Web: Create a `.env.local` file in the `apps/web` directory
- For Docs: Create a `.env.local` file in the `apps/docs` directory

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
