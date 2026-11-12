#!/bin/sh
# Run this to play Nobody's Hero on Linux (or a Mac). It starts the game's
# little server and opens the game in your web browser. Keep the terminal
# open while you play; press Ctrl+C (or close it) when you're done.
#
#   ./play.sh          the game on http://localhost:8000
#   ./play.sh 8001     another port (the browser keeps saves separately for each port)
#
# If double-clicking doesn't run it, open a terminal in this folder and type
# `sh play.sh`, or make it runnable once with `chmod +x play.sh`.

cd "$(dirname "$0")" || exit 1
PORT="${1:-8000}"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo
  echo " Python isn't installed, and the game needs it to run."
  echo " Install it with your package manager (for example: sudo apt install python3)"
  echo " or from https://www.python.org/downloads/ and try again."
  echo
  exit 1
fi

URL="http://localhost:$PORT"
echo
echo " Starting Nobody's Hero..."
echo " Your browser will open the game. If it doesn't, go to $URL"
echo " Keep this window open while you play. Press Ctrl+C to stop."
echo

# Open the browser a moment after the server starts.
(
  sleep 1
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1
  elif command -v open >/dev/null 2>&1; then open "$URL"
  fi
) &

# With the Studio here (the tools folder), start its server; otherwise the
# plain game server.
if [ -f tools/serve.py ]; then
  exec "$PYTHON" tools/serve.py "$PORT"
fi
exec "$PYTHON" play.py "$PORT"
