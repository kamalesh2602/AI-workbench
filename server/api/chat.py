from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from bson import ObjectId

from models.chat import ChatRequest

from services.chat_service import generate_answer
from services.search_service import get_context_chunks
from services.chat_history_service import save_chat
from services.current_user import get_current_user

from db.mongo import db


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/ask")
def ask_question(
    chat: ChatRequest,
    current_user=Depends(get_current_user)
):

    workspace = db.workspaces.find_one(
        {
            "_id": ObjectId(
                chat.workspace_id
            ),
            "user_id": str(
                current_user["_id"]
            )
        }
    )

    if not workspace:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    points = get_context_chunks(
        chat.question,
        chat.workspace_id
    )

    chunks = [
        point.payload["chunk_text"]
        for point in points
    ]

    sources = []
    seen_files = set()

    for point in points:

        filename = point.payload.get(
            "filename",
            "Unknown"
        )

        if filename not in seen_files:

            sources.append(
                {
                    "filename": filename
                }
            )

            seen_files.add(
                filename
            )

    answer = generate_answer(
        chat.question,
        chunks
    )

    save_chat(
        chat.workspace_id,
        chat.question,
        answer
    )

    return {
        "question": chat.question,
        "answer": answer,
        "sources": sources
    }


@router.get("/history/{workspace_id}")
def get_chat_history(
    workspace_id: str,
    current_user=Depends(get_current_user)
):

    workspace = db.workspaces.find_one(
        {
            "_id": ObjectId(
                workspace_id
            ),
            "user_id": str(
                current_user["_id"]
            )
        }
    )

    if not workspace:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    chats = []

    cursor = db.chat_messages.find(
        {
            "workspace_id": workspace_id
        }
    ).sort(
        "created_at",
        -1
    )

    for chat in cursor:

        chat["_id"] = str(
            chat["_id"]
        )

        chats.append(chat)

    return chats