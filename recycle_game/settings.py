from pathlib import Path

from jinja2 import Environment, FileSystemLoader

PORT = 8000
URL = '127.0.0.1'

URL_PREFIX = f'http://{URL}:{PORT}/'

BASE_DIR = Path(__file__).parent.parent
TEMPLATE_DIR = 'templates'
STATIC_URL = 'static'

TEMPLATE_ENV = Environment(
    loader=FileSystemLoader(searchpath=str(Path(BASE_DIR, TEMPLATE_DIR))))
