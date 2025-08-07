from app.utilities.db import Base, engine
from fastapi import FastAPI
from app.models.user import User  # ensure it's imported
from app.controller.resume_api import resumeRouter
from app.controller.auth_api import authRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Resume API",
    description="API for generating professional resumes.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://resume-builder-hnz65thqw-anoushka-kondojs-projects.vercel.app","http://localhost:5173"],  # React dev server origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumeRouter)
app.include_router(authRouter)

# Create all tables
Base.metadata.create_all(bind=engine)
