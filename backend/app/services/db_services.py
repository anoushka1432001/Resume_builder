from sqlalchemy.orm import Session
from app.models.user import User
from app.models.resume_form import ResumeForm
from app.utilities.pass_utilities import get_password_hash
from app.schemas.user import UserCreate
from app.schemas.resume_create import ResumeCreate
from fastapi import HTTPException

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_pwd = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def save_resume_to_db(db: Session, user_id: int, resume_create: ResumeCreate):
    form_json = resume_create.form_data.model_dump_json()
    
    resume_data = db.query(ResumeForm).filter_by(user_id=user_id).first()

    if resume_data:
        resume_data.form_json = form_json
    else:
        resume_data = ResumeForm(user_id=user_id, form_json=form_json)
        db.add(resume_data)

    db.commit()
    db.refresh(resume_data)
    return resume_data.id


def get_resume_by_user_id(db: Session, user_id: str):
    resume = db.query(ResumeForm).filter(ResumeForm.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume data found")

    return resume