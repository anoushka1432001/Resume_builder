from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.utilities.db import Base

class ResumeForm(Base):
    __tablename__ = "resume_forms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Store all form data as JSON string (can optimize later)
    form_json = Column(Text, nullable=True)
