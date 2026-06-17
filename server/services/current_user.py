from fastapi import Header
from fastapi import HTTPException

from bson import ObjectId

from db.mongo import db

from services.jwt_service import (
    decode_token
)


def get_current_user(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = decode_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.users.find_one(
        {
            "_id":
                ObjectId(
                    payload["sub"]
                )
        }
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user