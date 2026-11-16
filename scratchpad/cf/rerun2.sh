cd "c:/Users/clanc/Documents/Nobodys Hero"
python tools/playthrough.py notes/docs/chapter-1-playthrough.txt 9 10 > scratchpad/cf/rs_1.txt 2>&1
python tools/playthrough.py notes/docs/chapter-3-playthrough.txt 12 13 35 36 42 44 83 95 99 100 124 128 129 136 147 151 153 157 165 167 180 181 > scratchpad/cf/rs_3.txt 2>&1
python tools/playthrough.py notes/docs/chapter-4-playthrough.txt 12 14 16 46 47 96 > scratchpad/cf/rs_4.txt 2>&1
echo done > scratchpad/cf/rs_done.txt
