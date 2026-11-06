#!/bin/sh
# Double-click this to play Nobody's Hero on a Mac. It runs play.sh, which
# starts the game's little server and opens the game in your web browser.
# Keep the Terminal window open while you play.
cd "$(dirname "$0")" || exit 1
exec sh play.sh "$@"
