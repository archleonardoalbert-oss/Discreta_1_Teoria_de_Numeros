#!/bin/sh
# Ejecuta los tests de navegador. Argumento opcional: filtro por nombre.
cd "$(dirname "$0")/.." && NODE_PATH=.superpowers/dev/node_modules CHROMIUM=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome exec node tests/navegador.cjs "$@"
