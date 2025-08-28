from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from .config import SECRET_KEY, ALGORITHM 

pwd_cxt = CryptContext(schemes=['bcrypt'], deprecated='auto')

class Hash():
    def mybcrypt(password: str):
        return pwd_cxt.hash(password)
        

    def verify(hashed_password, plain_password):
        return pwd_cxt.verify(plain_password, hashed_password) 
    

ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt