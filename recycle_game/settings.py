from os import environ
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

URL = environ.get('URL', '0.0.0.0')
PORT = int(environ.get('PORT', 8000))

URL_PREFIX = f'http://{URL}:{PORT}/'

BASE_DIR = Path(__file__).parent.parent
TEMPLATE_DIR = 'templates'
STATIC_URL = 'static'

TEMPLATE_ENV = Environment(
    loader=FileSystemLoader(searchpath=str(Path(BASE_DIR, TEMPLATE_DIR))))
