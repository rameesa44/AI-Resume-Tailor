import os
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.pdfService import extract_text_from_pdf
from services.textProcessingService import clean_text


router = APIRouter()


UPLOAD_DIR = "uploads"


@router.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    extracted_text = extract_text_from_pdf(
        file_path
    )

    cleaned_text = clean_text(
        extracted_text
    )

    return {
        "filename": file.filename,
        "message": "Resume uploaded successfully",
        "text": cleaned_text
    }