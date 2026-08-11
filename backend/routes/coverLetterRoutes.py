from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.coverLetterService import generate_cover_letter


router = APIRouter()


class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/cover-letter")
async def create_cover_letter(
    data: CoverLetterRequest
):

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

    cover_letter = generate_cover_letter(
        data.resume_text,
        data.job_description
    )

    return {
        "cover_letter": cover_letter
    }