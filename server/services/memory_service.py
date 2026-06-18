from db.mongo import db


def get_recent_messages(
    workspace_id,
    limit=5
):

    messages = list(
        db.chat_messages.find(
            {
                "workspace_id":
                    workspace_id
            }
        )
        .sort("created_at", -1)
        .limit(limit)
    )

    messages.reverse()

    return messages