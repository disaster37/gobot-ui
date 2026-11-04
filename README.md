# dfp-ui

Pond / aquarium automation dashboard for the DFP (drum filter) and TFP (pump/filter/UVC)
hardware. Migrated from Ember.js 6.4 to **Nuxt v4**, **Nuxt UI v4**, **Pinia**, **Zod** and
**Day.js**.

## Stack

- [Nuxt v4](https://nuxt.com/) (`ssr: false`, static SPA generated with `nuxt generate`)
- [Nuxt UI v4](https://ui.nuxt.com/) (Tailwind CSS v4 + Reka UI)
- [Pinia](https://pinia.vuejs.org/) stores (`auth`, `boards`, `tfp`, `dfp`, `tanks`)
- [Zod](https://zod.dev/) form validation
- [Day.js](https://day.js.org/) date parsing/formatting
- [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) unit/component tests
- [Playwright](https://playwright.dev/) end-to-end smoke test

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js 24](https://nodejs.org/) with npm
- Optional: [Dagger](https://dagger.io/) for the reproducible CI pipeline

## Installation

```bash
git clone <repository-url>
cd dfp-ui
npm install
```

## Running / Development

```bash
npm run dev
```

The app is served at [http://localhost:4200](http://localhost:4200). Requests to `/backend/*`
are proxied to `process.env.BACKEND_URL` (default `http://127.0.0.1:4040`).

## Building

```bash
npm run build      # nuxt generate -> .output/public (and dist symlink)
npm run preview    # preview the generated output
```

## Testing & Quality

```bash
npm run lint           # eslint . && prettier --check .
npm run lint:fix       # autofix
npm run typecheck      # nuxt typecheck
npm run test           # vitest run
npm run test:coverage  # vitest run --coverage (statements/lines/functions >= 85%, branches >= 80%)
npm run test:e2e       # playwright test
```

## Authentication & Data

- `POST /backend/token-auth` returns `{ token }` (JWT). The token is stored in `localStorage`
  under `dfp_auth_token` (legacy `ember_simple_auth-session` tokens are migrated automatically).
- Every `/backend/api/*` request sends `Authorization: Bearer <token>`.
- All API payloads use JSON:API with snake*case attributes (including the preserved
  `acknoledge_waterfall_auto` typo and the `uvc1*\*`/`bacterium_time` casings).
- Real-time updates currently use background polling (`useRealtimeRefresh()`); the SSE seam is
  reserved for a follow-up PR.

## Dagger CI

The pipeline delegates 100% to pinned Daggerverse modules (`Dudesons/node`,
`build-core/node`, `disaster37/image`, `disaster37/codecov`). The thin orchestrator lives in
`.dagger/main.go`.

Short top-level invocations:

```bash
dagger call lint --src=.
dagger call typecheck --src=.
dagger call test --src=. export --path=./coverage
dagger call build --src=. export --path=./.output/public
dagger call build-static-image --src=. sync
dagger call ci --src=.
```

Direct Daggerverse invocations:

```bash
# Install + Lint + Typecheck + Coverage Tests + SPA Build (Dudesons/daggerverse/nodejs)
dagger call -m github.com/Dudesons/daggerverse/nodejs@20025a28c86e11511da0c8b23b8701c85b6b1e50 \
  with-pipeline-id --pipeline-id="gobot-ui" \
  with-version --version=24 \
  with-npm \
  with-source --src=. \
  install \
  lint \
  run --command=typecheck --capture-output=false \
  run --command=test:coverage --capture-output=false \
  build \
  directory --path=coverage \
  export --path=./coverage

# Build the Nginx SPA container (gitlab.com/build-core/daggerverse/node)
dagger call -m gitlab.com/build-core/daggerverse/node@40f0992e623b325f9fe3717ba01e144535f539e2 \
  build-static \
  --src=. \
  --package-manager=npm \
  --node-version=24 \
  --output-dir=.output/public \
  --nginx-config-path=docker/nginx.conf \
  sync

# Lint Dockerfile + Build image (disaster37/dagger-library-go/image)
dagger call -m github.com/disaster37/dagger-library-go/image@e205189be6eba617e7bcc870db2e73a04171f38e \
  ci --source=. --dockerfile=Dockerfile

# Upload coverage to Codecov (disaster37/dagger-library-go/codecov)
dagger call -m github.com/disaster37/dagger-library-go/codecov@e205189be6eba617e7bcc870db2e73a04171f38e \
  upload --src=. --token=env:CODECOV_TOKEN --files=coverage/lcov.info
```

## Deployment

The `Dockerfile` builds the static SPA in a Node 24 stage and serves `.output/public` from
Nginx 1.28, reverse-proxying `/backend/` to `http://dfp-api:4040/` via `docker/nginx.conf`.
