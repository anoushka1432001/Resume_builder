from pydantic import BaseModel
from app.schemas.form_data import RawFormData

class ResumeCreate(BaseModel):
    form_data: RawFormData

class ResumeResponse(BaseModel):
    id: int
    form_data: RawFormData

    class Config:
        orm_mode = True