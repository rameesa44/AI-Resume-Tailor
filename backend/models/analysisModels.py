from pydantic import BaseModel
from typing import List


class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    required_skills: List[str]
    missing_keywords: List[str]
    strengths: List[str]
    improvement_suggestions: List[str]
    explanation: str

class BulletRewriteRequest(BaseModel):
    resume_text: str
    job_description: str


class RewrittenBullet(BaseModel):
    original: str
    rewritten: str
    reason: str


class BulletRewriteResponse(BaseModel):
    rewritten_bullets: List[RewrittenBullet]

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str


class CoverLetterResponse(BaseModel):
    cover_letter: str