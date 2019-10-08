from recycle_game.base import require_http_methods, send_headers, \
    encode_view_result
from recycle_game.settings import TEMPLATE_ENV


@encode_view_result('utf-8')
def not_found(request):
    send_headers(request, response_code=404, content_type='text/plain')
    return "Oops! Sorry we can't find that page!\n404 Error"


@require_http_methods(['GET'], not_found)
@encode_view_result('utf-8')
def get_main_page(request):
    send_headers(request, content_type='text/html')
    return TEMPLATE_ENV.get_template('index.html').render()
