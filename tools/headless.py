"""Opens a page of the game in a headless browser (Edge or Chrome) and prints
its #report once it says CHECK DONE: for tools/preview.html's checks, which
render songs and so take real time (`--dump-dom` gives up before they finish).

    python tools/headless.py "http://localhost:8000/tools/preview.html?check=1&songs=1&song=usurperHero&seconds=190&window=10"

Needs the game's server running (tools/serve.py). Talks to the browser over
the DevTools protocol with nothing but the standard library.
"""

import base64
import json
import os
import socket
import struct
import subprocess
import sys
import tempfile
import time
import urllib.request

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]
PORT = 9333
DONE = "CHECK DONE"


class WebSocket:
    """Just enough of a websocket client to talk DevTools."""

    def __init__(self, url):
        _, rest = url.split("://", 1)
        host_port, path = rest.split("/", 1)
        host, port = host_port.split(":")
        self.sock = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall((
            f"GET /{path} HTTP/1.1\r\nHost: {host_port}\r\nUpgrade: websocket\r\n"
            f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
        ).encode())
        response = b""
        while b"\r\n\r\n" not in response:
            response += self.sock.recv(4096)
        if b" 101 " not in response.split(b"\r\n", 1)[0]:
            raise RuntimeError(f"websocket handshake failed: {response!r}")
        self.buffer = response.split(b"\r\n\r\n", 1)[1]

    def send(self, text):
        data = text.encode()
        header = bytearray([0x81])
        n = len(data)
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header += bytes([0x80 | 126]) + struct.pack(">H", n)
        else:
            header += bytes([0x80 | 127]) + struct.pack(">Q", n)
        mask = os.urandom(4)
        self.sock.sendall(bytes(header) + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def _read(self, n):
        while len(self.buffer) < n:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise RuntimeError("websocket closed")
            self.buffer += chunk
        out, self.buffer = self.buffer[:n], self.buffer[n:]
        return out

    def receive(self):
        first, second = self._read(2)
        length = second & 0x7F
        if length == 126:
            (length,) = struct.unpack(">H", self._read(2))
        elif length == 127:
            (length,) = struct.unpack(">Q", self._read(8))
        if second & 0x80:
            self._read(4)
        payload = self._read(length)
        if first & 0x0F == 0x08:
            raise RuntimeError("websocket closed")
        return payload.decode(errors="replace")


def evaluate(ws, expression, call_id):
    ws.send(json.dumps({"id": call_id, "method": "Runtime.evaluate", "params": {"expression": expression, "returnByValue": True}}))
    while True:
        message = json.loads(ws.receive())
        if message.get("id") == call_id:
            return message.get("result", {}).get("result", {}).get("value")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    url = sys.argv[1]
    timeout = float(sys.argv[2]) if len(sys.argv) > 2 else 600
    browser = next((b for b in BROWSERS if os.path.exists(b)), None)
    if not browser:
        sys.exit("No Edge or Chrome found")
    profile = tempfile.mkdtemp(prefix="headless-check-")
    process = subprocess.Popen(
        [browser, "--headless=new", "--disable-gpu", "--no-first-run", "--mute-audio",
         f"--remote-debugging-port={PORT}", f"--user-data-dir={profile}", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        for _ in range(100):
            try:
                tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json").read())
                break
            except OSError:
                time.sleep(0.1)
        else:
            sys.exit("The browser never opened its debugging port")
        tab = next(t for t in tabs if t["type"] == "page")
        ws = WebSocket(tab["webSocketDebuggerUrl"])
        ws.send(json.dumps({"id": 1, "method": "Page.navigate", "params": {"url": url}}))
        started = time.time()
        call_id = 2
        report = ""
        while time.time() - started < timeout:
            time.sleep(0.5)
            call_id += 1
            report = evaluate(ws, "document.getElementById('report') ? document.getElementById('report').textContent : ''", call_id) or ""
            if DONE in report or "ERROR:" in report:
                break
        else:
            print(f"TIMED OUT after {timeout:.0f}s; report so far:")
        print(report.strip())
    finally:
        process.kill()


if __name__ == "__main__":
    main()
