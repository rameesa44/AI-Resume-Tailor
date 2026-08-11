from fastapi import APIRouter, HTTPException

from models.analysisModels import (
    BulletRewriteRequest,
    BulletRewriteResponse
)

from services.bulletService import rewrite_bullets


router = APIRouter()


@router.post(
    "/resume/rewrite-bullets",
    response_model=BulletRewriteResponse
)
async def rewrite_resume_bullets(
    data: BulletRewriteRequest
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

    result = rewrite_bullets(
        data.resume_text,
        data.job_description
    )

    return result