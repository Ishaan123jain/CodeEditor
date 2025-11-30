from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .ws_manager import manager
from .routers import rooms, autocomplete

from .routers.rooms import router as rooms_router, get_db
from .routers.autocomplete import router as autocomplete_router

from .services.room_service import get_room_by_room_id, update_room_code


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(rooms.router)
app.include_router(autocomplete.router)


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)
    db = SessionLocal()
    try:
        room = get_room_by_room_id(db, room_id)
        if room:
            await websocket.send_json({"type": "init", "code": room.code})


        while True:
            data = await websocket.receive_json()
            if data.get("type") == "sync":
                code = data.get("code", "")
                manager.room_code[room_id] = code
                await manager.broadcast(room_id, {"type": "update", "code": code})
                update_room_code(db, room_id, code)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
    finally:
        db.close()



