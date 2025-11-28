from typing import Dict, List
from fastapi import WebSocket


# Simple manager: map room_id -> list of websockets, and in-memory code state
class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, List[WebSocket]] = {}
        self.room_code: Dict[str, str] = {} # in-memory last-known code per room


async def connect(self, room_id: str, websocket: WebSocket):
    await websocket.accept()
    self.active.setdefault(room_id, []).append(websocket)


def disconnect(self, room_id: str, websocket: WebSocket):
    if room_id in self.active and websocket in self.active[room_id]:
        self.active[room_id].remove(websocket)


async def broadcast(self, room_id: str, message: dict):
    conns = list(self.active.get(room_id, []))
    for conn in conns:
        try:
            await conn.send_json(message)
        except Exception:
        # ignore send errors; clients that fail will be cleaned up on disconnect
            pass


manager = ConnectionManager()