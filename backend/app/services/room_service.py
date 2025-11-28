import uuid
from sqlalchemy.orm import Session
from .. import models


def create_room(db: Session):
    room_id = uuid.uuid4().hex[:8]
    room = models.Room(room_id=room_id, code="")
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def get_room_by_room_id(db: Session, room_id: str):
    return db.query(models.Room).filter(models.Room.room_id == room_id).first()


def update_room_code(db: Session, room_id: str, code: str):
    room = get_room_by_room_id(db, room_id)
    if not room:
        return None
    room.code = code
    db.add(room)
    db.commit()
    db.refresh(room)
    return room
