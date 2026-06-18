from services.search_service import (
    get_context_chunks
)

from services.tavily_service import (
    search_web
)

from services.memory_service import (
    get_recent_messages
)

from services.web_decision_service import (
    should_search_web
)

def research(
    question,
    workspace_id
):

    history = get_recent_messages(
        workspace_id
    )
    conversation_context = ""

    for msg in history:

        conversation_context += f"""
    User:
    {msg['question']}

    Assistant:
    {msg['answer']}

    """
    points = get_context_chunks(
        question,
        workspace_id
    )

    workspace_context = "\n\n".join(
        [
            point.payload["chunk_text"]
            for point in points
        ]
    )
    
    web_results = []

    web_context = ""

    if should_search_web(
        question
    ):

        web_results = search_web(
            question
        )

        web_context = "\n\n".join(
            [
                result["content"]
                for result in web_results
            ]
        )

    workspace_sources = list(
    set(
        [
            point.payload.get(
                "filename",
                "Unknown"
            )
            for point in points
        ]
    )
)
    return {
    "workspace_context":
        workspace_context,

    "web_context":
        web_context,

    "conversation_context":
        conversation_context,

    "workspace_sources":
        workspace_sources,

    "sources":
        web_results
}