from services.llmService import llm
from models.analysisModels import ResumeAnalysisResponse
from rag.ragService import create_vector_store


structured_llm = llm.with_structured_output(
    ResumeAnalysisResponse
)


def is_valid_resume(resume_text: str) -> bool:
    """
    Check whether the uploaded document looks like a resume/CV.
    """

    text = resume_text.lower()

    resume_sections = [
        "skills",
        "experience",
        "education",
        "projects",
        "work experience",
        "professional experience",
        "technical skills",
        "summary",
        "objective",
        "certifications",
    ]

    assignment_words = [
        "assignment",
        "question",
        "answer",
        "chapter",
        "exercise",
        "submitted to",
        "roll no",
        "student id",
        "course instructor",
    ]

    # Count resume-related sections
    resume_score = sum(
        1 for section in resume_sections
        if section in text
    )

    # Count assignment/document indicators
    assignment_score = sum(
        1 for word in assignment_words
        if word in text
    )

    # If it strongly looks like an assignment/document
    if assignment_score >= 2 and resume_score < 3:
        return False

    # A proper resume should contain at least 2 resume sections
    if resume_score < 2:
        return False

    return True


def analyze_resume(
    resume_text: str,
    job_description: str
) -> ResumeAnalysisResponse:

    # --------------------------------------------------
    # 1. Validate uploaded document
    # --------------------------------------------------

    if not is_valid_resume(resume_text):

        return ResumeAnalysisResponse(
            ats_score=0,
            required_skills=[],
            missing_keywords=[],
            strengths=[],
            improvement_suggestions=[
                "Please upload a valid resume or CV.",
                "The uploaded document does not appear to contain standard resume sections."
            ],
            explanation=(
                "The uploaded document does not appear to be a resume. "
                "ATS analysis cannot be performed on an assignment or unrelated document. "
                "Please upload a valid CV or resume containing sections such as "
                "Skills, Experience, Education, or Projects."
            )
        )

    # --------------------------------------------------
    # 2. Create vector store
    # --------------------------------------------------

    vector_store = create_vector_store(
        resume_text,
        job_description
    )

    # --------------------------------------------------
    # 3. Retrieve relevant information
    # --------------------------------------------------

    query = f"""
    Analyze this candidate for the following job.

    Job description:
    {job_description}

    Find the most relevant:
    - candidate skills
    - work experience
    - projects
    - technologies
    - job requirements
    - keywords
    """

    retrieved_docs = vector_store.similarity_search(
        query,
        k=5
    )

    # --------------------------------------------------
    # 4. Build retrieved context
    # --------------------------------------------------

    retrieved_context = "\n\n".join(
        doc.page_content
        for doc in retrieved_docs
    )

    # --------------------------------------------------
    # 5. LLM analysis
    # --------------------------------------------------

    prompt = f"""
You are an expert ATS resume analyzer and professional recruiter.

Analyze the candidate's resume against the target job description.

IMPORTANT:
The ATS score must reflect the ACTUAL match between the resume
and job description.

Do NOT give a high score simply because the candidate has
general software development experience.

A missing core technology must significantly reduce the score.

RETRIEVED RESUME CONTEXT:
{retrieved_context}

FULL RESUME:
{resume_text}

FULL JOB DESCRIPTION:
{job_description}

Requirements:

1. Give an ATS compatibility score from 0 to 100.

2. Extract the important skills specifically required by
   THIS job description.

3. Identify important keywords from THIS job description
   that are missing from THIS resume.

4. Identify the candidate's strongest matching skills.

5. Give practical suggestions based specifically on the
   differences between this resume and this job.

6. Explain the score using the actual matches and missing
   requirements.

7. Do NOT invent experience.

8. Do NOT assume the candidate knows a technology just because
   it is related to another technology.

9. If Python is missing, do not consider Node.js as Python.

10. If FastAPI is missing, do not consider Express.js as FastAPI.

11. If PostgreSQL is missing, do not consider MongoDB as PostgreSQL.

12. If Docker is missing, do not consider general backend experience
    as Docker experience.

13. Missing core job requirements should substantially reduce
    the ATS score.

14. General transferable skills such as REST APIs, Git,
    authentication, and CRUD can receive partial relevance,
    but they must NOT compensate for all missing core technologies.

15. The explanation must be specific to THIS resume and THIS job.
   Do not use generic explanations.

16. Do not produce the same explanation for different jobs.
   Mention the actual matching and missing technologies.

17. Only use information available in the resume and job description.

Return the result in the required structured format.
"""

    result = structured_llm.invoke(prompt)

    return result