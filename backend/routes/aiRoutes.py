from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.llmService import llm


router = APIRouter()


class AIRequest(BaseModel):
    message: str


@router.post("/ai/test")
async def test_ai(data: AIRequest):

    if not data.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    response = llm.invoke(data.message)

    return {
        "message": "LLM response generated successfully",
        "response": response.content
    }