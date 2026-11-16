#!/bin/bash
# usage: stills.sh tag room:x:y ...
cd "c:/Users/clanc/Documents/Nobodys Hero"
tag=$1; shift
for spec in "$@"; do
  IFS=: read room x y extra <<< "$spec"
  python tools/headless.py "http://localhost:8000/tools/preview.html?room=$room&x=$x&y=$y&chapter=5&with=vesper,bramble$extra" 40 scratchpad/r3d/${tag}_$room.png | tail -1
done
