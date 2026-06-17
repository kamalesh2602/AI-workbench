import os

from jose import jwt
from jose import JWTError

from datetime import datetime
from datetime import timedelta

SECRET_KEY = os.getenv(
    "JWT_SECRET"
)

ALGORITHM = "HS256"


def create_access_token(
    user_id: str
):

    payload = {
        "sub": user_id,
        "exp":
            datetime.utcnow()
            + timedelta(days=7)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_token(
    token: str
):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None