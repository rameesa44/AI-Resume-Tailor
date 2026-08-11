from services.llmService import llm
from models.analysisModels import BulletRewriteResponse
from rag.ragService import create_vector_store


structured_llm = llm.with_structured_output(
    BulletRewriteResponse
)


def rewrite_bullets(
    resume_text: str,
    job_description: str
) -> BulletRewriteResponse:

    vector_store = create_vector_store(
        resume_text,
        job_description
    )

    docs = vector_store.similarity_search(
        "Find the candidate's actual experience, skills, projects, "
        "and existing resume bullet points that are relevant to "
        "the target job.",
        k=5
    )

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    prompt = f"""
You are an expert resume writer and ATS optimization specialist.

Your task is to rewrite the candidate's EXISTING resume bullet points
so they are stronger and more relevant to the target job.

RELEVANT RESUME CONTEXT:
{context}

FULL RESUME:
{resume_text}

TARGET JOB DESCRIPTION:
{job_description}

IMPORTANT RULES:

1. Rewrite ONLY information that actually exists in the resume.
2. NEVER invent technologies, skills, companies, achievements,
   responsibilities, metrics, or experience.
3. Preserve the original meaning of every bullet.
4. Use job-description keywords ONLY when the resume genuinely
   supports them.
5. Use strong action verbs.
6. Make each bullet concise and ATS-friendly.
7. Focus on actual experience and projects from the resume.
8. Do not create fake numbers or percentages.
9. Return multiple improved bullets when possible.
10. Return the original bullet, rewritten bullet, and reason.

Make the rewritten bullets meaningfully different from generic
resume text while remaining completely truthful.

Return the result in the required structured format.
"""

    result = structured_llm.invoke(prompt)

    return result