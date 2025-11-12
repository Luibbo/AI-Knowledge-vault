from fastapi import UploadFile
from pypdf import PdfReader
from docx import Document

async def file_parser(file: UploadFile) -> str:
    content = ""

    if file.filename.endswith(".txt"):
        # Читання текстового файлу
        content = (await file.read()).decode("utf-8", errors="ignore")

    elif file.filename.endswith(".pdf"):
        # Читання PDF
        pdf_reader = PdfReader(file.file)
        for page in pdf_reader.pages:
            content += page.extract_text() or ""

    elif file.filename.endswith(".docx"):
        # Читання DOCX
        doc = Document(file.file)
        content = "\n".join([para.text for para in doc.paragraphs])

    else:
        raise ValueError("Unsupported file format. Only .txt, .pdf, .docx are allowed.")

    return content.strip()
