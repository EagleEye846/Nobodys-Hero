cd "c:/Users/clanc/Documents/Nobodys Hero"
for spec in ruins_entrance:1 taper_home:1 vigil_ridge:2 rest_square:2 pinefall_landing:3 hush_felled_run:3 marsh_jetty:3 lasthome_square:3 city_old_street:3 glimmer_landing:4 diggings_pithead:4 belowtown_market:4 deep_first_dark:4 saltcombe_market:5 wrack_dunes:5 wreck_hull:5 lanes_fork:5 isles_landing:5 reach_eye:5 sunny_hayfields:5 ship_deck:5 ash_orchard:6 ash_waystation:6 isles_east_light:5 soundings_up:5 pinefall_brook:3; do
  r=${spec%%:*}; c=${spec##*:}
  python tools/headless.py "http://localhost:8000/tools/preview.html?room=$r&chapter=$c&with=vesper,bramble" 60 scratchpad/cf/stills/${r}_after.png > /dev/null 2>&1
  python tools/headless.py "http://localhost:8077/tools/preview.html?room=$r&chapter=$c&with=vesper,bramble" 60 scratchpad/cf/stills/${r}_before.png > /dev/null 2>&1
done
echo done > scratchpad/cf/stills/done.txt
