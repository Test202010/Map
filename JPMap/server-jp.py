from http.server import SimpleHTTPRequestHandler, HTTPServer
import os


class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)


if __name__ == "__main__":
    httpd = HTTPServer(('localhost', 8000), CustomHandler)
    print("Serving on port 8000...")
    httpd.serve_forever()
