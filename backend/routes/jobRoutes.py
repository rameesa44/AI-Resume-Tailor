from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.textProcessingService import clean_text


router = APIRouter()


class JobDescriptionRequest(BaseModel):
    job_description: str


@router.post("/job-description")
async def process_job_description(
    data: JobDescriptionRequest
):

    if not data.job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    cleaned_description = clean_text(
        data.job_description
    )

    return {
        "message": "Job description received successfully",
        "job_description": cleaned_description
    }