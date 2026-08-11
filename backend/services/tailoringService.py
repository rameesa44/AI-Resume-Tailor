from pydantic import BaseModel
from typing import List

from services.llmService import llm


class TailoredBullet(BaseModel):
    original: str
    rewritten: str


class TailoringResult(BaseModel):
    bullets: List[TailoredBullet]


structured_llm = llm.with_structured_output(
    TailoringResult
)


def rewrite_bullets(
    resume_text: str,
    job_description: str
) -> TailoringResult:

    prompt = f"""
You are a professional resume writer.

Rewrite the candidate's resume bullet points to better match
the target job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Rules:

- Improve wording and relevance.
- Naturally incorporate relevant job keywords.
- Keep the candidate's real experience truthful.
- Never invent technologies, companies, achievements,
  responsibilities or metrics.
- Do not add skills that are not supported by the resume.
- Keep each rewritten bullet concise and professional.
- Preserve the original meaning.

Return the original and rewritten versions.
"""

    return structured_llm.invoke(prompt)