"""Inspect official homepage image references without executing page scripts."""
import concurrent.futures
import json
import urllib.request
import requests
from html.parser import HTMLParser
from urllib.parse import urljoin

SITES = {
    'doctoreto': 'https://doctoreto.com/',
    'pgpic': 'https://www.linkedin.com/company/persian-gulf-petrochemical-industries',
    'isc': 'https://www.linkedin.com/company/isc-informatics-services-corporation-',
    'mahsan': 'https://www.linkedin.com/company/mahsan',
    'snapp': 'https://www.linkedin.com/company/snapp.ir',
}

class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'img' and ('logo' in str(data).lower() or len(self.items) < 2):
            self.items.append(data)
        if tag == 'link' and 'icon' in data.get('rel', ''):
            self.items.append(data)

def inspect(item):
    key, url = item
    try:
        res = requests.get(url, timeout=18)
        res.raise_for_status()
        parser = Images()
        parser.feed(res.text)
        result = {'company': key, 'url': res.url, 'images': parser.items[:8]}
        if key == 'doctoreto':
            pos = res.text.find('iezPus logo')
            result['header'] = res.text[pos:pos+2300]
        return result
    except Exception as err:
        return {'company': key, 'error': str(err)}

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        print(json.dumps(list(pool.map(inspect, SITES.items())), ensure_ascii=False, indent=2))
