# AV Cueboard

This module connects Bitfocus Companion to the **AV Cueboard** desktop application.

Download AV Cueboard: https://github.com/alanimedia/avcueboard

## Configuration

- **AV Cueboard IP Address**: The IP address of the machine running AV Cueboard (default: `127.0.0.1`).
- **AV Cueboard Port**: The WebSocket port from App Config (default: `8877`). This is **not** the HTTP remote port.
- **Attempt Reconnect**: If checked, the module reconnects automatically after a disconnect.

## Features

- Per-cue actions keyed by cue ID (stable across reordering) plus grid-position actions
- Cue list and presets follow the app's grid layout order (sections supported)
- Playback, stop, trigger, playlist navigation, live volume, and seek actions
- Variables and feedbacks for playback time, fade state, and current cue
- Preset buttons use each cue's custom `buttonColor` when configured

## Setup

1. Run AV Cueboard and confirm WebSocket is enabled in App Config.
2. Add this module in Companion (from Connections when listed, or via **Developer modules path** — see the [app README](https://github.com/alanimedia/avcueboard#manual-module-install-until-store-approval)).
3. Add an instance of **Alani Media → AVCueboard**.
4. Set the IP and WebSocket port (`8877` by default).
5. Import presets or assign actions — use **Trigger: &lt;cue name&gt;** actions for the most reliable cue targeting.

## Troubleshooting

- If buttons stop working after an app update, re-import presets or switch actions to the per-cue **Trigger: ...** entries.
- Confirm Companion connects on the WebSocket port, not the HTTP remote port (`3000` by default).
