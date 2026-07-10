# AV Cueboard — Companion Module

Companion module for **[AV Cueboard](https://github.com/alanimedia/avcueboard)** — live audio cue playback for Bitfocus Companion and Stream Deck.

## Requirements

- **AV Cueboard** app v1.10.0+ with WebSocket enabled (default port **8877**)
- Bitfocus Companion 3.x+
- Node.js 18+ and Yarn 1 (for manual / local install)

## Repositories

| Component | Repository |
|---|---|
| App | https://github.com/alanimedia/avcueboard |
| This module (Alani Media) | https://github.com/alanimedia/avcueboard-companion-module |
| Bitfocus store repo (when available) | https://github.com/bitfocus/companion-module-alanimedia-avcueboard |

## Install from Connections (when approved)

1. Run AV Cueboard and confirm WebSocket is on in App Config.
2. In Companion, add **Alani Media → AVCueboard**.
3. Set host IP and WebSocket port (`8877` default).
4. Import presets or assign per-cue actions.

## Manual install (until Bitfocus store approval)

1. Create a developer modules folder, e.g. `C:\companion-module-dev`.
2. Clone this repo **into** that folder:
   ```bash
   cd C:\companion-module-dev
   git clone https://github.com/alanimedia/avcueboard-companion-module.git
   cd avcueboard-companion-module
   yarn install
   yarn build
   ```
3. In the Companion launcher, open the **cog** and set **Developer modules path** to `C:\companion-module-dev` (the parent folder).
4. Restart Companion, then add **Alani Media → AVCueboard** under Connections.

Full steps are also in the [AV Cueboard README](https://github.com/alanimedia/avcueboard#manual-module-install-until-store-approval).  
Bitfocus docs: [Local / developer modules](https://companion.free/for-developers/module-development/local-modules/)

HTTP remote (port **3000** default) is for the web/iPad UI — not Companion.

## Development

```bash
yarn install
yarn build
```

Enable commit hooks: `yarn setup:hooks` (or `npm run setup:hooks`).

## License & credits

MIT — see [LICENSE](LICENSE).

AV Cueboard and this module continue work originally published as **acCompaniment** by **Marcin Wardecki** ([mko1989/acCompaniment](https://github.com/mko1989/acCompaniment)), MIT licensed. Modifications © Omar Gadahn, [Alani Media](https://alani.media).
