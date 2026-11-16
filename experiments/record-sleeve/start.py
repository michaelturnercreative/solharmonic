"""Optional localhost-only launcher. Requires Python 3; no packages needed."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser

if __name__ == "__main__":
    root = str(Path(__file__).resolve().parent)
    handler = partial(SimpleHTTPRequestHandler, directory=root)
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        url = "http://127.0.0.1:%s/" % server.server_port
        print("SolHarmic:", url, "— Ctrl+C to stop", flush=True)
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
