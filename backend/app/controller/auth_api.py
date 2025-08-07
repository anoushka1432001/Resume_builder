from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.utilities.db import get_db
from app.utilities.jwt_handler import create_access_token, verify_token
from app.utilities.pass_utilities import verify_password
from app.utilities.auth_utilities import get_current_user
from fastapi.responses import JSONResponse
from app.services.db_services import create_user, get_user_by_email
from datetime import timedelta

authRouter = APIRouter(tags=["Authentication"],)

@authRouter.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = create_user(db, user)
    token = create_access_token(data={"user_id": new_user.id, "name": new_user.name}, expires_delta = timedelta(hours=1))
    
    return JSONResponse(content={"access_token": token, "token_type": "bearer"})

@authRouter.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"user_id": db_user.id, "name": db_user.name}, expires_delta = timedelta(hours=1))
    
    return JSONResponse(content={"access_token": token, "token_type": "bearer"})

@authRouter.get("/verify-token")
def verify_token_route(user_id = Depends(get_current_user)):
    return {"valid": True, "user_id": user_id}