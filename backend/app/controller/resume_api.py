from fastapi import APIRouter, Depends
from app.schemas.resume import ResumeData
from app.services.render_resume import render_resume_to_file
from app.utilities.auth_utilities import get_current_user
from app.schemas.resume_create import ResumeCreate, ResumeResponse
from app.models.resume_form import ResumeForm
from sqlalchemy.orm import Session
from app.utilities.db import get_db
from app.services.db_services import save_resume_to_db, get_resume_by_user_id
import json

resumeRouter = APIRouter(tags=["resumes"])

@resumeRouter.post("/generate/resume")
async def get_resume_data(
    resume_data: ResumeData,
    _: str = Depends(get_current_user)
):
    return render_resume_to_file(resume_data.dict())

@resumeRouter.get("/print/data")
def print_resume_data(resume_data: ResumeData):
    print(resume_data)

@resumeRouter.post("/save/resume")
def save_resume(
    payload: ResumeCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    resume_id = save_resume_to_db(db, user_id, payload)
    return {"message": "Resume saved successfully", "resume_id": resume_id}

@resumeRouter.get("/get/resume", response_model=ResumeResponse)
def get_resume(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    resume = get_resume_by_user_id(db, user_id)
    resume_data = ResumeResponse(
        id=resume.id,
        form_data=json.loads(resume.form_json)
    )
    return resume_data