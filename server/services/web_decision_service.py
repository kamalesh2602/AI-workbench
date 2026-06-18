def should_search_web(question):

    keywords = [
        "latest",
        "recent",
        "current",
        "today",
        "news",
        "trend",
        "trends",
        "update",
        "updates",
        "2025",
        "2026"
    ]

    question = question.lower()

    return any(
        keyword in question
        for keyword in keywords
    )