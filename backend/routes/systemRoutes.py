from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def check_server():
    return {
        "status": "healthy",
        "message": "AI Resume Tailor backend is running"
    }