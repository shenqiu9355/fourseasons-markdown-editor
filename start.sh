#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
EDITOR="$ROOT/editor"
CONFIG="$EDITOR/config.json"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-7865}"
WORKSPACE="${WORKSPACE:-}"

if [ ! -f "$CONFIG" ]; then
  cp "$EDITOR/config.example.json" "$CONFIG"
fi

echo "Starting Four Seasons Markdown Editor..."
echo "URL: http://$HOST:$PORT"

if [ -n "$WORKSPACE" ]; then
  python3 "$EDITOR/server.py" --host "$HOST" --port "$PORT" --config "$CONFIG" --workspace "$WORKSPACE"
else
  python3 "$EDITOR/server.py" --host "$HOST" --port "$PORT" --config "$CONFIG"
fi
