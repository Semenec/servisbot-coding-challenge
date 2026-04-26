# servicesbot-frontend

React dashboard for the bots / workers / logs API. Built with Vite + Ant Design + TanStack Query + React Router.

## Stack

- **React 19** + **TypeScript**, bundled with **Vite**
- **Ant Design 5** for tables, layout, and feedback components
- **TanStack Query 5** for server state
- **React Router 6** for navigation
- **Vitest 4** + **React Testing Library** + **jsdom** for tests

## Layout

```
src/
├── main.tsx
├── App.tsx                  # router + QueryClientProvider + antd Layout shell
├── api/
│   ├── apiClient.ts         # fetch wrapper, builds URLs from VITE_API_URL
│   └── types.ts             # Bot / Worker / LogEntry contracts
├── hooks/
│   ├── useQueries.ts        # one useQuery per endpoint
│   └── usePagination.ts     # syncs page / pageSize to ?query params
├── pages/                   # route entry points
├── components/
│   ├── common/              # presentational (BreadcrumbTrail, EmptyState, …)
│   ├── Bots/                # BotsContainer + BotsTable + BotStatusBadge
│   ├── Workers/             # BotWorkersContainer + WorkersTable
│   └── Logs/                # BotLogsContainer + WorkerLogsContainer + LogsTable
├── utils/date.ts
└── test/setup.ts            # vitest setup: jest-dom matchers, cleanup, matchMedia shim
```

Each feature follows a **Container → Table** split: containers wire the route params + query hooks + loading/error/empty switchboard, tables are pure presentational components driven by props.

## Setup

```bash
npm install
cp .env.example .env       # if present, otherwise create one (see below)
npm run dev
```

### Environment

| Variable       | Purpose                                                                               |
| -------------- | ------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3000`). The client appends `/api/...` to it. |

## Run

```bash
npm run dev        # vite dev server
npm run build      # tsc -b && vite build
npm run preview    # serve the production build locally
```

## Tests

```bash
npm test           # vitest run
npm run test:watch
npm run test:cov   # vitest with v8 coverage
```

Tests live next to the components they cover (`*.test.tsx`). The suite covers:

- **`common/`** — pure presentational components (`EmptyState`, `PageLoadingState`, `TitleWithDescription`, `BreadcrumbTrail`).
- **Tables** — `BotsTable`, `WorkersTable`, `LogsTable`: row rendering, link targets, pagination callbacks, conditional columns.
- **Containers** — `BotsContainer`, `BotWorkersContainer`, `BotLogsContainer`, `WorkerLogsContainer`: loading / error / empty / loaded states. The `useQueries` and `usePagination` hooks are mocked per test; route params come from a real `<MemoryRouter>` + `<Route>`.

## Routing

| Path                                  | Component        |
| ------------------------------------- | ---------------- |
| `/`                                   | `BotsPage`       |
| `/bots/:botId/workers`                | `BotWorkersPage` |
| `/bots/:botId/logs`                   | `BotLogsPage`    |
| `/bots/:botId/workers/:workerId/logs` | `WorkerLogsPage` |
| `*`                                   | `NotFoundPage`   |

## Pagination

`usePagination` reads `?page=` and `?pageSize=` from the URL (defaults: page 1, pageSize 10) and writes them back via `setSearchParams(..., { replace: true })`. Both names are sent to the backend as-is — no translation layer.

## Linting & formatting

```bash
npm run lint
npm run lint:fix
npm run cs        # prettier --check
npm run cs:fix    # prettier --write
```
