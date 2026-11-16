cd "c:/Users/clanc/Documents/Nobodys Hero"
for c in 1 2 3 4 5 6; do python tools/playthrough.py notes/docs/chapter-$c-playthrough.txt > scratchpad/cf/pt_$c.txt 2>&1; done
echo ALLDONE > scratchpad/cf/pt_done.txt
