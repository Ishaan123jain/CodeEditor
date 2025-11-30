from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..services.room_service import create_room, get_room_by_room_id
from ..schemas import RoomOut


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/rooms", response_model=RoomOut)
def post_room(db: Session = Depends(get_db)):
    room = create_room(db)
    return {"roomId": room.room_id}   # <-- MUST MATCH SCHEMA


@router.get("/rooms/{room_id}")
def get_room(room_id: str, db: Session = Depends(get_db)):
    room = get_room_by_room_id(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="room not found")
    return {"roomId": room.room_id, "code": room.code}