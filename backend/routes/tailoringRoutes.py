from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.tailoringService import rewrite_bullets


router = APIRouter()


class TailoringRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/resume/tailor")
async def tailor_resume(data: TailoringRequest):

    if not data.resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text cannot be empty"
        )

    if not data.job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    result = rewrite_bullets(
        data.resume_text,
        data.job_description
    )

    return result