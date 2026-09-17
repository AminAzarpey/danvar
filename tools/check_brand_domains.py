"""Read-only .com registry checks; a 404 is not a registrar availability quote."""

import concurrent.futures
import datetime
import json
import urllib.error
import urllib.request

NAMES = ['artaverno', 'mehravesto', 'atravira', 'artaniva', 'mehrasta', 'atrunava']


def check(name):
    url = f'https://rdap.verisign.com/com/v1/domain/{name}.com'
    result = {'domain': f'{name}.com', 'source': url}
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            result.update(status=response.status, result='registered')
    except urllib.error.HTTPError as error:
        result.update(status=error.code, result='no registry record' if error.code == 404 else 'unknown')
    except Exception as error:
        result.update(result='unknown', error=type(error).__name__)
    return result


if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, NAMES))
    print(json.dumps({'checked_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                      'results': results}, indent=2))
