# Gompyo ERP

## Installation

- `pnpm`: 10.6.3
- `node`: 23.9.0

```bash
pnpm install
```

## Project Structure

```bash
# tree -L 2 -I node_modules
.
├── __mocks__
│   ├── nextFontMock.js
│   └── styleMock.js
├── __tests__
│   └── index.test.tsx
├── changes.patch
├── coverage
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov-report
│   └── lcov.info
├── drizzle
│   └── database.sqlite
├── drizzle.config.ts
├── drizzle.test.ts
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   └── logo.png
├── README.md
├── src
│   ├── actions
│   ├── app
│   ├── components
│   ├── constants
│   ├── containers
│   ├── db
│   ├── libs
│   ├── styles
│   └── types
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## How to run

```bash
pnpm run dev
```

## DB

### DB setting

```bash
pnpm drizzle:push
```
