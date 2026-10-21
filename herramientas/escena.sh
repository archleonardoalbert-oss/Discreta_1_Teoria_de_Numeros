#!/bin/sh
cd "$(dirname "$0")/.." && NODE_PATH=${NODE_PATH:-.superpowers/dev/node_modules} CHROMIUM=${CHROMIUM:-$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome} exec node herramientas/escena.cjs "$@"
