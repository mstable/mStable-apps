# mStable Apps

Web frontends for interacting with the mStable contracts.

---

## Apps

This repository comprises multiple mStable apps, all built using common libraries and a common UI.

| Status | Name               | Nx project   | Port | Public hosts                                                                                                                                                                       |
| ------ | ------------------ | ------------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅     | mStable Protocol   | `protocol`   | 3000 | <ul><li>[Fleek/IPFS 1](https://mstable.app)</li><li>[Fleek/IPFS 2](https://app.mstable.org)</li><li>[Google Cloud](https://mstable-apps-protocol.web.app/)</li></ul>               |
| ✅     | mStable Governance | `governance` | 3200 | <ul><li>[Fleek/IPFS 1](https://staking.mstable.app)</li><li>[Fleek/IPFS 2](https://staking.mstable.org)</li><li>[Google Cloud](https://mstable-apps-governance.web.app/)</li></ul> |
| 🧠     | ...more            |              |      |                                                                                                                                                                                    |

---

## Development

This project was generated using [Nx](https://nx.dev).

### Quickstart

```bash
# Copy the default env vars so they can be overridden
cp .env .env.local

# Now edit the Subgraph API key env vars to add a local API key
# e.g. `vim .env.local`

# Then install, codegen, and run the apps
yarn
yarn codegen:typechain
yarn nx serve --parallel --all
```

### Running an app

```bash
yarn nx run protocol:serve
```

### Building an app

```bash
yarn nx run protocol:build
```

### NX module boundaries

To get the benefit of nx modules, it's important to avoid creating dependency cycles. ESlint is set up to catch this, so simply run:

```bash
yarn nx affected:lint
```
