from http.server import BaseHTTPRequestHandler, HTTPServer

from recycle_game.base import process_static
from recycle_game.settings import PORT, URL
from recycle_game.urls import urls
from recycle_game.views import not_found


class SimpleRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        body_content = urls.get(self.path, process_static)(self) \
                       or not_found(self)
        self.wfile.write(body_content.encode('utf-8'))


def run(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler, url=URL,
        port=PORT):
    try:
        handler = server_class((url, port), handler_class)
        handler.serve_forever()
    except KeyboardInterrupt:
        print('Stopped')
    finally:
        handler.socket.close()
