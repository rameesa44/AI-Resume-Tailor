from fastapi import APIRouter, HTTPException

from models.analysisModels import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse
)

from services.analysisService import analyze_resume


router = APIRouter()


@router.post(
    "/resume/analyze",
    response_model=ResumeAnalysisResponse
)
async def resume_analysis(
    data: ResumeAnalysisRequest
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

    result = analyze_resume(
        data.resume_text,
        data.job_description
    )

    return result