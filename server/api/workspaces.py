from fastapi import APIRouter, HTTPException
from models.workspace import WorkspaceCreate
from db.mongo import db
from datetime import datetime
from bson import ObjectId
from fastapi import Depends
from services.current_user import get_current_user


router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"]
)


def validate_object_id(workspace_id: str):
    try:
        return ObjectId(workspace_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid workspace id"
        )


def serialize_workspace(workspace):
    workspace["_id"] = str(workspace["_id"])
    return workspace



@router.post("/")
def create_workspace(workspace: WorkspaceCreate,current_user=Depends(get_current_user)):

    

    result = db.workspaces.insert_one(
   {
    "name": workspace.name,
    "description": workspace.description,
    "user_id": str(current_user["_id"]),
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}
)

    return {
    "name": workspace.name,
    "description": workspace.description,
    "user_id": str(current_user["_id"]),
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}


@router.get("/")
def get_workspaces( current_user=Depends(get_current_user)):

    workspaces = []

    cursor = db.workspaces.find(
    {
        "user_id":
            str(current_user["_id"])
    }
).sort(
    "created_at",
    -1
)
    for workspace in cursor:
        workspaces.append(
            serialize_workspace(workspace)
        )

    return workspaces

@router.get("/recent")
def get_recent_workspaces(current_user=Depends(get_current_user)):

    workspaces = []

    cursor = (
        db.workspaces
        .find(
            {
                "user_id":
                    str(
                        current_user["_id"]
                    )
            }
        )
        .sort("created_at", -1)
        .limit(5)
    )

    for workspace in cursor:

        workspace["_id"] = str(
            workspace["_id"]
        )

        workspaces.append(
            workspace
        )

    return workspaces

@router.get("/{workspace_id}")
def get_workspace(workspace_id: str,current_user=Depends(get_current_user)):

    object_id = validate_object_id(workspace_id)

    workspace = db.workspaces.find_one(
    {
        "_id": object_id,
        "user_id":
            str(
                current_user["_id"]
            )
    }
)

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    return serialize_workspace(workspace)


@router.put("/{workspace_id}")
def update_workspace(
    workspace_id: str,
    workspace: WorkspaceCreate, current_user=Depends(get_current_user)
):

    object_id = validate_object_id(workspace_id)

    result = db.workspaces.update_one(
        {
    "_id": object_id,
    "user_id":
        str(current_user["_id"])
},
        {
            "$set": {
                "name": workspace.name,
                "description": workspace.description,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    updated_workspace = db.workspaces.find_one(
    {
        "_id": object_id,
        "user_id":
            str(current_user["_id"])
    }
)

    return serialize_workspace(updated_workspace)


@router.delete("/{workspace_id}")
def delete_workspace(workspace_id: str,current_user=Depends(get_current_user)):

    object_id = validate_object_id(workspace_id)

    result = db.workspaces.delete_one(
        {
    "_id": object_id,
    "user_id":
        str(current_user["_id"])
}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found"
        )

    return {
        "message": "Workspace deleted"
    }


