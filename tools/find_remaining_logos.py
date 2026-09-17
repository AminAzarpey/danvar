from concurrent.futures import ThreadPoolExecutor
import json
import requests
from bs4 import BeautifulSoup

PAGES = {
    'melal': 'https://t.me/s/melal_bank_ir/3488',
    'isc': 'https://digiato.com/company/get-to-know-informatics-services-corporation',
    'mahsan': 'https://logoyab.com/?s=مهسان',
    'fam': 'https://logoyab.com/?s=فام',
    'melal-vector': 'https://logoyab.com/?s=ملل',
}

def inspect(item):
    key, url = item
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, 'html.parser')
        result = {'id': key, 'url': r.url}
        if 'logoyab' in url:
            result['links'] = [{'title': a.get_text(' ', strip=True), 'url': a.get('href')} for a in soup.select('h2 a, h3 a')][:15]
        else:
            result['images'] = [dict(i.attrs) for i in soup.select('meta[property="og:image"], img')][:14]
        return result
    except Exception as e:
        return {'id': key, 'error': str(e)}

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=5) as pool:
        print(json.dumps(list(pool.map(inspect, PAGES.items())), ensure_ascii=False, indent=2))
