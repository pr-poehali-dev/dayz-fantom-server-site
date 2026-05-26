import socket
import struct
import os

def query_dayz_server(host: str, port: int, timeout: float = 3.0) -> dict:
    """Опрашивает DayZ сервер через Source Query Protocol (A2S_INFO)."""
    A2S_INFO = b'\xFF\xFF\xFF\xFFTSource Engine Query\x00'

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)

    try:
        sock.sendto(A2S_INFO, (host, port))
        data, _ = sock.recvfrom(4096)
    finally:
        sock.close()

    # Парсим ответ Source Query
    if len(data) < 6:
        raise ValueError("Слишком короткий ответ от сервера")

    offset = 4  # пропускаем \xFF\xFF\xFF\xFF
    header = data[offset]; offset += 1
    if header != 0x49:  # 'I' — A2S_INFO response
        raise ValueError(f"Неожиданный заголовок: {header}")

    protocol = data[offset]; offset += 1

    def read_string(d, o):
        end = d.index(b'\x00', o)
        return d[o:end].decode('utf-8', errors='replace'), end + 1

    name, offset = read_string(data, offset)
    map_name, offset = read_string(data, offset)
    folder, offset = read_string(data, offset)
    game, offset = read_string(data, offset)

    app_id = struct.unpack_from('<H', data, offset)[0]; offset += 2
    players = data[offset]; offset += 1
    max_players = data[offset]; offset += 1
    bots = data[offset]; offset += 1
    server_type = chr(data[offset]); offset += 1
    environment = chr(data[offset]); offset += 1
    visibility = data[offset]; offset += 1
    vac = data[offset]; offset += 1
    version, offset = read_string(data, offset)

    return {
        "online": True,
        "name": name,
        "map": map_name,
        "players": players,
        "max_players": max_players,
        "bots": bots,
        "version": version,
        "vac": bool(vac),
    }


def handler(event: dict, context) -> dict:
    """Возвращает реальный статус DayZ сервера Fantom."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    HOST = "80.82.38.165"
    # DayZ Query port = game port + 24714 (стандарт для DayZ)
    # Для порта 2302 query port = 27016
    QUERY_PORT = 27016

    try:
        info = query_dayz_server(HOST, QUERY_PORT, timeout=3.0)
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': {
                'online': True,
                'name': info['name'],
                'map': info['map'],
                'players': info['players'],
                'max_players': info['max_players'],
                'version': info['version'],
                'ip': f"{HOST}:2302",
            }
        }
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': {
                'online': False,
                'name': 'Fantom',
                'map': 'Chernarus+',
                'players': 0,
                'max_players': 60,
                'version': '1.29',
                'ip': f"{HOST}:2302",
                'error': str(e),
            }
        }
