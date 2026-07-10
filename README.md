# AV Cueboard — Companion Module

Companion module for **[AV Cueboard](https://github.com/alanimedia/avcueboard)** — live audio cue playback for Bitfocus Companion and Stream Deck.

## Requirements

- **AV Cueboard** app v1.10.0+ with WebSocket enabled (default port **8877**)
- Bitfocus Companion 3.x / 4.x+

## Download packaged module (Companion 4.x.x or greater)

Ready-to-install package (no Node/Yarn needed on the Companion machine):

https://github.com/alanimedia/avcueboard-companion-module/raw/main/packages/alanimedia-avcueboard-1.10.0.tgz

### Install in Companion 4.x.x or greater (recommended)

1. Download the `.tgz` from the link above.
2. Launch Companion and open the Admin UI.
3. Go to **Modules → Add Module Package** and select that file.  
   This adds it to the list of available modules.
4. Go to **Connections** → add **Alani Media → AVCueboard**.
5. Host: IP of the AV Cueboard PC (`127.0.0.1` if same machine). Port: **8877**.

When the module is approved on the [Connections](https://bitfocus.io/connections) store, prefer installing from there instead.

## Repositories

| Component | Repository |
|---|---|
| App | https://github.com/alanimedia/avcueboard |
| This module | https://github.com/alanimedia/avcueboard-companion-module |
| Bitfocus store repo (when available) | https://github.com/bitfocus/companion-module-alanimedia-avcueboard |

## Install from Connections (when approved)

1. Run AV Cueboard and confirm WebSocket is on in App Config.
2. In Companion, add **Alani Media → AVCueboard**.
3. Set host IP and WebSocket port (`8877` default).
4. Import presets or assign per-cue actions.

## Alternative: developer modules path

For live development, clone this repo into a developer modules folder and point Companion’s **Developer modules path** at the parent directory. See [Bitfocus local modules docs](https://companion.free/for-developers/module-development/local-modules/).

```bash
yarn install
yarn build
```

HTTP remote (port **3000** default) is for the web/iPad UI — not Companion.

## Development

```bash
yarn install
yarn build   # also produces alanimedia-avcueboard-<version>.tgz
```

Copy the new `.tgz` into [`packages/`](packages/) when cutting a release. Enable commit hooks: `yarn setup:hooks`.

## License & credits

MIT — see [LICENSE](LICENSE).

AV Cueboard and this module continue work originally published as **acCompaniment** by **Marcin Wardecki** ([mko1989/acCompaniment](https://github.com/mko1989/acCompaniment)), MIT licensed. Modifications © Omar Gadahn, [Alani Media](https://alani.media).
