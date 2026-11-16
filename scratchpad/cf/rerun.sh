cd "c:/Users/clanc/Documents/Nobodys Hero"
python tools/playthrough.py notes/docs/chapter-1-playthrough.txt 17 > scratchpad/cf/rr_1.txt 2>&1
python tools/playthrough.py notes/docs/chapter-2-playthrough.txt 12 13 14 21 22 34 54 55 56 59 60 67 88 89 91 100 101 102 > scratchpad/cf/rr_2.txt 2>&1
python tools/playthrough.py notes/docs/chapter-3-playthrough.txt 35 36 38 39 98 99 100 101 116 122 123 130 132 182 > scratchpad/cf/rr_3.txt 2>&1
python tools/playthrough.py notes/docs/chapter-4-playthrough.txt 12 14 16 39 43 53 55 57 59 > scratchpad/cf/rr_4.txt 2>&1
python tools/playthrough.py notes/docs/chapter-5-playthrough.txt 17 51 53 56 58 81 85 97 122 125 134 139 140 141 143 145 146 161 171 176 189 195 197 199 204 208 215 217 225 234 248 283 307 309 311 315 326 327 328 339 340 346 350 > scratchpad/cf/rr_5.txt 2>&1
echo done > scratchpad/cf/rr_done.txt
