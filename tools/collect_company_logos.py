"""Download identified brand assets and retain their source information."""
from pathlib import Path
import concurrent.futures
import json
import requests
from html.parser import HTMLParser
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'logos'
SOURCES = {
    'mahak': 'https://mahak-charity.org/wp-content/themes/kalhors-mahak/images/logo.svg',
    'doctoreto': 'https://doctoreto.com/images/doctoreto-logo.png',
    'snapp': 'https://static.cdnlogo.com/logos/s/90/snapp.svg',
    'tourism-bank': 'https://logobanks.ir/images/bank/gardeshgari.svg',
    'cbi': 'https://logobanks.ir/images/bank/bank-markazi.svg',
}

class OriginalFile(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        url = a.get('href', '')
        if tag == 'a' and 'upload.wikimedia.org' in url and url.endswith('.svg'):
            self.urls.append(url)

def download(item):
    name, url = item
    try:
        r = requests.get(url, timeout=20)
        r.raise_for_status()
        if '<svg' in r.text[:1500] and url.endswith('.svg'):
            ext = '.svg'
            if '<script' in r.text.lower() or '<foreignobject' in r.text.lower():
                raise ValueError('Active SVG content')
        elif r.content.startswith(b'\x89PNG'):
            ext = '.png'
        else:
            raise ValueError('Not a recognized image')
        dest = OUT / (name + ext)
        dest.write_bytes(r.content)
        return {'id': name, 'source': url, 'path': '/logos/' + dest.name, 'bytes': len(r.content), 'status': 'downloaded'}
    except Exception as error:
        return {'id': name, 'source': url, 'status': 'unavailable', 'error': str(error)}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    page = 'https://commons.wikimedia.org/wiki/File:Snapp!_logo_(Farsi).svg'
    try:
        r = requests.get(page, timeout=20)
        r.raise_for_status()
        parser = OriginalFile()
        parser.feed(r.text)
        if parser.urls:
            SOURCES['snapp'] = parser.urls[0]
    except Exception as error:
        print('Snapp source lookup:', type(error).__name__)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(download, SOURCES.items()))
    (OUT / 'sources.json').write_text(json.dumps({'checked': '2026-09-12', 'snapp_provenance': page, 'assets': results}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(results, ensure_ascii=False, indent=2))
