from services.llmService import llm


def generate_cover_letter(
    resume_text: str,
    job_description: str
) -> str:

    prompt = f"""
You are a professional career writer.

Create a customized cover letter for the candidate based
strictly on their resume and the target job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Requirements:

- Professional and natural tone.
- Tailored specifically to this job.
- Highlight relevant experience and skills.
- Do not invent experience or qualifications.
- Avoid generic filler.
- Keep it concise, approximately 300-400 words.
- Do not use placeholders.
- Return only the cover letter.
"""

    response = llm.invoke(prompt)

    return response.content