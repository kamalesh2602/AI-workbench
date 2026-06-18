from fastapi import APIRouter
from db.mongo import db
from fastapi import HTTPException
from models.user import UserRegister
from models.user import UserLogin

from services.auth_service import (
    hash_password,
    verify_password
)

from services.jwt_service import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register_user(
    user: UserRegister
):

    existing_user = db.users.find_one(
        {
            "email": user.email
        }
    )

    if existing_user:

        return {
            "message":
            "Email already exists"
        }

    result = db.users.insert_one(
        {
            "name": user.name,
            "email": user.email,
            "password":
                hash_password(
                    user.password
                )
        }
    )

    return {
        "user_id":
            str(
                result.inserted_id
            )
    }

@router.post("/login")
def login_user(
    user: UserLogin
):

    existing_user = db.users.find_one(
        {
            "email": user.email
        }
    )

    if not existing_user:
        raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

    valid_password = (
        verify_password(
            user.password,
            existing_user["password"]
        )
    )

    if not valid_password:
        raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

    token = create_access_token(
        str(existing_user["_id"])
    )

    return {
        "token": token
    }