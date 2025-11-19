from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from .config import SECRET_KEY, ALGORITHM 
from jwt.exceptions import InvalidTokenError
from ..db.schemas import TokenData
from ..db.models import User
from ..db.database import get_db
from sqlalchemy.orm import Session


pwd_cxt = CryptContext(schemes=['bcrypt'], deprecated='auto')

class Hash():
    def mybcrypt(password: str):
        return pwd_cxt.hash(password)
        

    def verify(hashed_password, plain_password):
        return pwd_cxt.verify(plain_password, hashed_password) 
    

ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print("------------Trying get user-----------")
    try:
        print(f"token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        login = payload.get("sub")
        print(login)
        if login is None:
            raise credentials_exception
        token_data = TokenData(login=login)
    except InvalidTokenError:
        raise credentials_exception
    user = db.query(User).filter(User.login==token_data.login).first()
    if not user:
        raise credentials_exception
    print("------------User got succesfully-------------")
    return user
