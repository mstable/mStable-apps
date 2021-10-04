# mStable Apps

Web frontends for interacting with the mStable contracts.

---
## Apps

This repository comprises multiple mStable apps, all built using common libraries and a common UI.

| Status | Name               | Nx project    | Port  | Public hosts |
|--------|--------------------|---------------|-------|--------------|
| ✅      | mStable Protocol   | `protocol`   | 3000 | [Fleek/IPFS 1](https://mstable.app) – [Fleek/IPFS 2](https://app.mstable.org) – [Google](https://mstable-apps-protocol.web.app/) |
| ✅      | mStable Governance | `governance` | 3200 |  [Fleek/IPFS 1](https://staking.mstable.app) – [Fleek/IPFS 2](https://staking.mstable.org) |
| ✅      | (example app)      | `example`    | 3100 |              |
| 🧠      | ...more            |              |      |             |

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
