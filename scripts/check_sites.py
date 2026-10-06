#!/usr/bin/env python3
"""Read-only smoke checks for the current public sites; no login or orders."""
import concurrent.futures
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser

TARGETS = [
    ('https://www.gastroradwan.eu/', 200, 'GASTRORADWAN'),
    ('https://www.gastroradwan.eu/poptavka.html', 200, 'mailto:info@gastroradwan.eu'),
    ('https://www.gastroradwan.eu/prihlaseni.html', 200, 'Přihlášení'),
    ('https://ez.gastroradwan.eu/', 200, 'web/index.html'),
    ('https://ez.gastroradwan.eu/web/index.html', 200, 'EZApp'),
    ('https://shop.gastroradwan.eu/', 200, 'GastroRadwan'),
    ('https://ez.gastroradwan.eu/api/customer-linkage', 401, None),
]

class Resources(HTMLParser):
    def __init__(self):
        super().__init__(); self.paths = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'img') and attrs.get('src'):
            self.paths.add(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon'):
            self.paths.add(attrs.get('href', ''))

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'GastroRadwan-Availability/1.0'})
    try:
        response = urllib.request.urlopen(request, timeout=20)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, response.url, response.headers, response.read(2_000_000)

def check(target):
    url, expected, marker = target
    try:
        status, final, headers, body = fetch(url)
        result = {'url': url, 'status': status, 'expected': expected,
                  'ok': status == expected and final.startswith('https://')}
        content = body.decode('utf-8', 'replace')
        if marker and marker not in content:
            result['ok'] = False; result['error'] = 'Expected page content missing'
        resources = []
        if marker and result['ok'] and 'text/html' in headers.get('Content-Type', ''):
            parser = Resources(); parser.feed(content)
            for path in parser.paths:
                resource = urllib.parse.urljoin(final, path)
                # Visit only resources hosted on the same site.
                if urllib.parse.urlsplit(resource).netloc == urllib.parse.urlsplit(final).netloc:
                    resources.append((resource, 200, None))
        return result, resources
    except Exception as error:
        return {'url': url, 'ok': False, 'error': type(error).__name__}, []

def main():
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        initial = list(pool.map(check, TARGETS))
        resources = set()
        for result, paths in initial:
            results.append(result); resources.update(paths)
        for result, _ in pool.map(check, sorted(resources)):
            results.append(result)
        for host in ('www.gastroradwan.eu', 'ez.gastroradwan.eu', 'shop.gastroradwan.eu'):
            result, _ = check(('http://' + host + '/', 200, None))
            results.append(result)
    report = {'checked_at': datetime.now(timezone.utc).isoformat(),
              'ok': all(r['ok'] for r in results), 'checks': results}
    with open('site-health.json', 'w', encoding='utf-8') as output:
        json.dump(report, output, ensure_ascii=False, indent=2)
    for result in results:
        print(('PASS' if result['ok'] else 'FAIL'), result['url'], result.get('status', result.get('error')))
    return 0 if report['ok'] else 1

if __name__ == '__main__':
    sys.exit(main())
