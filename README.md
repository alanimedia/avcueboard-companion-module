# AV Cueboard — Companion Module

Companion module for **[AV Cueboard](https://github.com/alanimedia/avcueboard)** — live audio cue playback for Bitfocus Companion and Stream Deck.

> Formerly maintained as acCompaniment / HighPass. This is a **new** Connections listing under **Alani Media** (`alanimedia-avcueboard`), not an upgrade of `highpass-accompaniment`.

## Requirements

- **AV Cueboard** app v1.10.0+ with WebSocket enabled (default port **8877**)
- Bitfocus Companion 3.x+

## Repositories

| Component | Repository |
|---|---|
| App | https://github.com/alanimedia/avcueboard |
| Module (Bitfocus) | https://github.com/bitfocus/companion-module-alanimedia-avcueboard |
| Dev copy (Alani Media) | https://github.com/alanimedia/avcueboard-companion-module |

## Quick setup

1. Run AV Cueboard and confirm WebSocket is on in App Config.
2. In Companion, add **Alani Media → AVCueboard**.
3. Set host IP and WebSocket port (`8877` default).
4. Import presets or assign per-cue actions.

HTTP remote (port **3000** default) is for the web/iPad UI — not Companion.

## Development

```bash
yarn install
yarn build
```

Enable commit hooks: `yarn setup:hooks`

## License

MIT — see [LICENSE](LICENSE).
