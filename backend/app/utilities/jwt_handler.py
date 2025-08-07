from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from config import settings
from fastapi import HTTPException, status

# Create a JWT access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    print(to_encode)
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)))
    to_encode.update({"exp": expire,
                    "iat": datetime.utcnow(),})
    
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Verify a JWT access token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload  # return the decoded payload if successful
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
