from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from .routers import rooms, autocomplete
from .ws_manager import manager
from .database import engine, Base
from .services.room_service import get_room_by_room_id, update_room_code
from .database import SessionLocal


Base.metadata.create_all(bind=engine)


app = FastAPI()


app.include_router(rooms.router)
app.include_router(autocomplete.router)


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    # Expect client to send/receive JSON messages with shape: { "type": "sync", "code": "...", "cursor": 10 }
    await manager.connect(room_id, websocket)
    # on connect, load persisted code if present and send to the client
    db = SessionLocal()
    try:
        room = get_room_by_room_id(db, room_id)
        if room:
        # send initial state
            await websocket.send_json({"type": "init", "code": room.code})


        while True:
            data = await websocket.receive_json()
            if data.get("type") == "sync":
                code = data.get("code", "")
                # update in-memory state and persist
                manager.room_code[room_id] = code
                # simple last-write wins: broadcast to others
                await manager.broadcast(room_id, {"type": "update", "code": code})
                # persist (non-blocking in this simple example we will persist synchronously)
                update_room_code(db, room_id, code)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
    finally:
        db.close()