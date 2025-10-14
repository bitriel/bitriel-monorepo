# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **pnpm + Turborepo monorepo** for cross-platform apps built with Expo. It demonstrates a production-ready setup optimized for fast builds and development through aggressive caching strategies.

**Key Technologies:**

- Package Manager: **pnpm** (v10.12.1+) with workspace protocol
- Build System: **Turborepo** for task orchestration and caching
- Framework: **Expo SDK 54** with React Native 0.81.4 and React 19.1.0
- Routing: **Expo Router** (file-based routing)
- Testing: **Jest** with jest-expo preset
- Linting: **ESLint** with eslint-config-universe

## Monorepo Structure

```
apps/
  mobile/           - Expo app with expo-router, uses feature-home package
packages/
  eslint-config/    - Shared ESLint configuration (base: eslint-config-universe)
  feature-home/     - Domain logic package (depends on ui package)
  ui/               - React Native UI components (leaf package)
```

**Dependency Flow:** `mobile` → `feature-home` → `ui` → (external deps)

**Important:** All packages use `workspace:*` protocol for internal dependencies. React Native only supports a single version per monorepo - use `pnpm why --recursive react-native` to verify no version conflicts.

## Essential Commands

### Development

```bash
pnpm install              # Install all dependencies (always run first)
pnpm dev                  # Start dev servers for ALL apps
pnpm dev:mobile           # Start dev server for mobile app only (faster)
```

### Building

```bash
pnpm build                # Build all apps and packages for production
pnpm build:mobile         # Build mobile app and its dependencies only
```

### Quality Checks

```bash
pnpm lint                 # Run ESLint on all workspaces
pnpm test                 # Run all Jest tests across packages
```

### App-Specific Commands (run from apps/mobile/)

```bash
pnpm start                # Start Expo dev server
pnpm android              # Run on Android device/emulator
pnpm ios                  # Run on iOS device/simulator
pnpm web                  # Run web version
pnpm test                 # Run tests for mobile app only
```

## Architecture Details

### Turborepo Configuration (turbo.json)

- **build**: Depends on `^build` (dependencies first), caches `build/**` and `node_modules/.cache/metro/**`
- **dev**: Not cached, interactive mode enabled, persistent task
- **test**: Caches based on `**/*.{ts,tsx,js,jsx}` input files
- **lint**: No specific outputs cached

### Metro Caching Strategy

The mobile app uses a custom Metro config (apps/mobile/metro.config.js) that stores cache in `node_modules/.cache/metro`. Turborepo tracks this directory in its build outputs, enabling cache restoration across CI/CD runs and local builds.

**Critical:** When using environment variables in React Native code, be aware that Metro may cache incorrect values. This repo uses Expo's built-in environment variable support to avoid Babel plugin caching issues.

### EAS Build Configuration (apps/mobile/eas.json)

- **monorepo profile**: Base profile with pnpm 9.15.4, caches Turbo cache at `../../node_modules/.cache/turbo`, sets `EXPO_USE_FAST_RESOLVER=true`
- **development profile**: Internal distribution, Android APK builds
- **production profile**: Store distribution, Android app bundles
- **Post-install hook**: `eas-build-post-install` runs `pnpm run -w build:mobile` to build dependencies

### Expo Configuration

- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Experiments**: Typed routes and React Compiler enabled
- **Routing**: File-based routing via expo-router in `apps/mobile/app/` directory
- **Platforms**: iOS, Android, and Web (static output for web)

### Package Structure

All packages (`feature-home`, `ui`) follow this pattern:

- **Main entry**: `src/index.ts` (TypeScript source, no build step needed in dev)
- **Peer dependencies**: React, React Native, and React Native Web (both RN packages marked optional)
- **Dev dependencies**: Expo, Jest, ESLint config, React dependencies (for testing)
- **Testing**: jest-expo preset configured

### Workspace Filtering

Single-app commands use Turborepo filtering:

- `dev:mobile` → `turbo dev --filter="{./apps/mobile}..."`
- `build:mobile` → `turbo build --filter="...{./apps/mobile}"`

These filters ensure only the target app and its transitive dependencies are processed.

## Critical Constraints

### React Native Version Management

**Never install multiple versions of React Native.** This will break the monorepo in unpredictable ways.

Check for version conflicts:

```bash
pnpm why --recursive react-native
```

If multiple versions exist, update all package.json files or use root-level overrides/resolutions.

### Running EAS Commands

EAS commands (`eas build`, `eas deploy`) **must be run from the apps/mobile/ directory**, not the monorepo root. EAS will create a tarball of the entire monorepo but executes build commands from the app directory.

Example:

```bash
cd apps/mobile
eas build --profile development
```

### Package Manager Lock

The `packageManager` field in root package.json pins pnpm to a specific version (10.12.1). The repository is configured with `dangerouslyDisablePackageManagerCheck: true` in turbo.json to suppress warnings.

## Code Formatting

Prettier configuration (root package.json):

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

## Testing

- All packages use **jest-expo** preset
- Run tests from root with `pnpm test` (runs all tests via Turborepo)
- Run single package tests: `cd packages/ui && pnpm test`
- Testing library: @testing-library/react-native

## Making Changes

### Adding a New Package

1. Create package directory under `packages/`
2. Add to `pnpm-workspace.yaml` if not already covered by glob
3. Use `workspace:*` protocol for internal dependencies
4. Add ESLint config: `"@bitriel/eslint-config": "workspace:*"` in devDependencies
5. Configure jest-expo preset if tests needed
6. Mark React Native as optional peer dependency

### Adding Dependencies

```bash
# Add to specific package
pnpm add <package> --filter @bitriel/ui

# Add to all packages
pnpm add -r <package>

# Add to root (dev tooling only)
pnpm add -w <package>
```

### Modifying Turbo Tasks

Edit `turbo.json` to change caching behavior. Key fields:

- `dependsOn`: Task dependencies (use `^taskName` for dependencies' tasks)
- `outputs`: Files/directories to cache
- `inputs`: Files that invalidate cache when changed
- `cache`: Set to `false` for non-cacheable tasks

## Common Pitfalls

1. **Metro cache reuse with env vars**: If using Babel plugins like `transform-inline-environment-variables`, Metro may cache wrong values. Use Expo's built-in env var support or configure Turborepo to invalidate cache on env changes.

2. **Running commands from wrong directory**: Most commands should be run from monorepo root. Exception: EAS commands must run from `apps/mobile/`.

3. **Missing builds**: If getting import errors, ensure dependencies are built: `pnpm build` or let Turborepo handle it automatically during `dev`.

4. **pnpm workspace protocol**: When switching package managers, replace `"workspace:*"` with `"*"` for npm compatibility.
