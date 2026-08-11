from pydantic import BaseModel, Field
from typing import List


class JobDescriptionData(BaseModel):
    job_title: str = ""

    required_skills: List[str] = Field(
        default_factory=list
    )

    preferred_skills: List[str] = Field(
        default_factory=list
    )

    keywords: List[str] = Field(
        default_factory=list
    )

    responsibilities: List[str] = Field(
        default_factory=list
    )