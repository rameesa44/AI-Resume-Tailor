from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.coverLetterRoutes import router as cover_letter_router
from routes.systemRoutes import router as system_router
from routes.resumeRoutes import router as resume_router
from routes.jobRoutes import router as job_router
from routes.aiRoutes import router as ai_router
from routes.analysisRoutes import router as analysis_router
from routes.tailoringRoutes import router as tailoring_router
from routes.rewriteRoutes import router as rewrite_router


app = FastAPI(
    title="AI Resume Tailor API",
    description="AI-powered resume analysis and job matching system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    system_router,
    prefix="/api"
)

app.include_router(
    resume_router,
    prefix="/api"
)

app.include_router(
    job_router,
    prefix="/api"
)

app.include_router(
    ai_router,
    prefix="/api"
)

app.include_router(
    analysis_router,
    prefix="/api"
)

app.include_router(
    tailoring_router,
    prefix="/api"
)

app.include_router(
    cover_letter_router,
    prefix="/api"
)

app.include_router(
    rewrite_router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "AI Resume Tailor API is running"
    }