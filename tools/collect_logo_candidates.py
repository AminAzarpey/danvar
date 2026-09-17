"""Collect public cached domain icons for visual verification, never auto-publish."""
import concurrent.futures
import json
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'design' / 'logo-candidates'
DOMAINS = {'cbi': 'cbi.ir', 'isc': 'isc.co.ir', 'tourism-bank': 'tourismbank.ir',
           'fam': 'fam724.ir', 'melal-bank': 'melalbank.ir', 'pgpic': 'pgpic.ir',
           'mahsan': 'mahsan.co', 'monoppy': 'monoppy.ir'}

def fetch(item):
    key, domain = item
    url = f'https://www.google.com/s2/favicons?domain={domain}&sz=256'
    try:
        res = requests.get(url, timeout=20)
        res.raise_for_status()
        if not res.content.startswith(b'\x89PNG'):
            raise ValueError('Not PNG')
        (OUT / f'{key}.png').write_bytes(res.content)
        return {'id': key, 'domain': domain, 'source': url, 'resolved': res.url,
                'bytes': len(res.content), 'status': 'candidate-needs-visual-review'}
    except Exception as error:
        return {'id': key, 'domain': domain, 'status': 'unavailable', 'error': str(error)}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(fetch, DOMAINS.items()))
    (OUT / 'sources.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2))
