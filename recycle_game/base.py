from functools import wraps
from mimetypes import guess_type
from pathlib import Path

from recycle_game.settings import BASE_DIR, STATIC_URL


def require_http_methods(request_method_list, error_handler):
    def decorator(func):
        @wraps(func)
        def inner(request, *args, **kwargs):
            if request.command not in request_method_list:
                return error_handler(request, *args, **kwargs)
            return func(request, *args, **kwargs)
        return inner
    return decorator


def send_headers(request, response_code: int = 200,
                 content_type: str = 'text/html', **kwargs):
    request.send_response(response_code)
    request.send_header('Content-type', content_type)
    for k, v in kwargs.items():
        request.send_header(k, v)
    request.end_headers()


def process_static(request):
    filename = request.path.rsplit('/', 2)[-2:]
    path = Path(BASE_DIR, STATIC_URL, *filename)
    if path.exists():
        send_headers(request, content_type=guess_type(request.path)[0])
        return path.read_text('utf-8')
