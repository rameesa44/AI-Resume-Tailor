import re


def clean_text(text: str) -> str:
    """
    Cleans extracted resume or job description text.
    """

    if not text:
        return ""

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    # Remove leading/trailing spaces
    text = text.strip()

    return text