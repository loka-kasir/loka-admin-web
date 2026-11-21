"""Mengisi keadaan contoh di server Billing LOKAL (database lokakasir_billing_social_demo) supaya
layar kasir bisa ditangkap: shift terbuka, beberapa sesi berjalan, pesanan F&B, member, dan booking.
Hanya untuk server lokal di 127.0.0.1:8097; tidak pernah menyentuh produksi."""
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError
from urllib.request import Request, urlopen
import json

BASE = 'http://127.0.0.1:8097/api/v1'
WIB = timezone(timedelta(hours=7))
token = None

def api(method, path, body=None):
    headers = {'Accept': 'application/json'}
    if token: headers['Authorization'] = 'Bearer ' + token
    if body is not None:
        body = json.dumps(body).encode(); headers['Content-Type'] = 'application/json'
    try:
        with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=20) as response:
            return json.load(response).get('data')
    except HTTPError as error:
        raise RuntimeError(f'{method} {path}: {error.code} {error.read()[:200]!r}') from None

# Akun contoh server lokal. Password bawaan (admin123) wajib diganti saat login pertama; di database
# contoh ini sudah diganti menjadi nilai di bawah. Bukan kredensial produksi.
PASSWORD = 'contoh-lokal-2026'
token = api('POST', '/auth/login', {'username': 'admin', 'password': PASSWORD})['token']
api('PUT', '/settings', {**api('GET', '/settings'), 'store_name': 'Loka Game Center'}) if isinstance(api('GET', '/settings'), dict) else None
if not api('GET', '/shifts/current'):
    api('POST', '/shifts/open', {'opening_cash': 300000, 'note': ''})
stations = {s['code']: s for s in api('GET', '/stations')}
packages = api('GET', '/packages')
products = {p['name']: p for p in api('GET', '/products')}
def package(name, console):
    return next(p for p in packages if p['name'] == name and (p.get('console_type') or console) == console)['id']

plan = [('TV01', 'package', ('2 Jam', 'PS4'), 'Raka'), ('TV02', 'open', None, 'Dimas'), ('TV03', 'package', ('3 Jam Hemat', 'PS4'), 'Budi'),
        ('TV05', 'package', ('1 Jam', 'PS5'), 'Tio'), ('TV06', 'open', None, 'Fajar'), ('VIP1', 'package', ('2 Jam', 'PS5'), 'Sinta')]
for code, mode, pick, customer in plan:
    station = stations[code]
    if station.get('session'): continue
    body = {'billing_mode': mode, 'customer_name': customer, 'note': ''}
    if pick: body['package_id'] = package(*pick)
    started = api('POST', f"/stations/{station['id']}/start", body)
    session = started.get('session') or {}
    if code in ('TV03', 'TV06') and session.get('id'):
        names = list(products)[:2]
        for name in names:
            api('POST', f"/sessions/{session['id']}/orders", {'product_id': products[name]['id'], 'qty': 1})
if not api('GET', '/members'):
    for name, phone, amount, bonus in [('Raka Pratama', '081200001111', 100000, 10000), ('Sinta Maharani', '081200002222', 50000, 0),
                                       ('Dimas Saputra', '081200003333', 200000, 25000), ('Tio Ramadhan', '081200004444', 50000, 5000)]:
        member = api('POST', '/members', {'name': name, 'phone': phone, 'note': '', 'is_active': True})
        api('POST', f"/members/{member['id']}/topup", {'amount': amount, 'bonus': bonus, 'payment_method': 'cash', 'note': ''})
today = datetime.now(WIB).strftime('%Y-%m-%d')
if not api('GET', f'/bookings?from={today}&to={today}'):
    for code, name, hour, minutes in [('TV04', 'Andi', 9, 120), ('TV07', 'Yoga', 10, 60), ('TV04', 'Komunitas FC', 12, 60), ('TV05', 'Nanda', 11, 120), ('VIP1', 'Sinta', 13, 120)]:
        start = datetime.now(WIB).replace(hour=hour, minute=0, second=0, microsecond=0)
        if start < datetime.now(WIB) + timedelta(minutes=10): start += timedelta(days=1)
        api('POST', '/bookings', {'station_id': stations[code]['id'], 'customer_name': name, 'phone': '', 'start_at': start.isoformat(),
                                  'duration_minutes': minutes, 'note': ''})
print('stasiun bersesi:', sum(1 for s in api('GET', '/stations') if s.get('session')), '| member:', len(api('GET', '/members')), '| booking hari ini:', len(api('GET', f'/bookings?from={today}&to={today}') or []))
