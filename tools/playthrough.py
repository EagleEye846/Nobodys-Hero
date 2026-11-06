"""Runs the walk-through lines of a playthrough file (room|seen|extra|script, one per line)
in headless Edge/Chrome, one at a time, and prints PASS/FAIL for each.

    python tools/playthrough.py notes/docs/chapter-3-playthrough.txt            # every line
    python tools/playthrough.py notes/docs/chapter-3-playthrough.txt hush_gorge # only lines for that room

A line "#extra: with=vesper" in the file gives the extra query used by every line whose own extra field is empty.

Needs the game's server (tools/serve.py; set PORT below or pass --port N). Retries a line when the dev server drops a fetch."""
import subprocess, sys, time, urllib.parse

args = sys.argv[1:]
port = 8000
if '--port' in args:
    i = args.index('--port'); port = int(args[i + 1]); del args[i:i + 2]
path, only = args[0], args[1:]
default_extra = ''
for n, line in enumerate(open(path, encoding='utf8'), 1):
    line = line.rstrip('\n')
    if line.startswith('#extra:'):
        default_extra = line[7:].strip()
        continue
    if not line.strip() or line.startswith('#'):
        continue
    room, seen, extra, script = line.split('|', 3)
    extra = extra or default_extra
    if only and room not in only and str(n) not in only:
        continue
    query = f"play={room}&doors=1&seen={seen}&{extra}&script={urllib.parse.quote(script, safe=':;,')}"
    url = f"http://localhost:{port}/tools/preview.html?{query}"
    for _ in range(25):
        out = subprocess.run([sys.executable, 'tools/headless.py', url, '300'], capture_output=True, text=True, encoding='utf8').stdout
        if 'ailed to load' in out or 'ailed to fetch' in out or ('PLAY DONE' not in out and 'PLAY FAIL' not in out):
            time.sleep(3)
            continue
        break
    bad = 'PLAY FAIL' in out or 'PLAY DONE' not in out
    print(f"{'FAIL' if bad else 'PASS'} L{n} {room}", flush=True)
    if bad:
        print('\n'.join(out.splitlines()[-4:])[:1200], flush=True)
