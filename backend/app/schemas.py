from pydantic import BaseModel


class RoomCreate(BaseModel):
    pass


class RoomOut(BaseModel):
    roomId: str


class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str


class AutocompleteResponse(BaseModel):
    suggestion: str