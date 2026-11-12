"""Serves Nobody's Hero to your web browser, so you can play it.

    python play.py          then open http://localhost:8000
    python play.py 8001     another port (the browser keeps saves separately for each port)

Play.bat (Windows), Play.command (Mac) and play.sh (Linux) run this for you.
It only hands the game's files to the browser on this computer: nothing can
be saved or changed through it, and nothing outside this computer can reach it.
"""

import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class GameHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    # Always hand over fresh files, so an updated game never mixes with an old one.
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    # Quiet: no line in the window for every file the game loads.
    def log_message(self, format, *args):
        pass


class GameServer(ThreadingHTTPServer):
    # Never share the port with another server (Windows otherwise lets a
    # second one bind the same port, and the browser may reach that one).
    allow_reuse_address = sys.platform != "win32"

    def server_bind(self):
        if sys.platform == "win32":
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def main():
    port = next((int(a) for a in sys.argv[1:] if a.isdigit()), 8000)
    try:
        server = GameServer(("127.0.0.1", port), GameHandler)
    except OSError:
        print(f"Port {port} is already in use, probably by the game still running in another window.")
        print(f"Close that window, or start this one on another port: python play.py {port + 1}")
        sys.exit(1)
    print(f"Nobody's Hero: http://localhost:{port}/")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
