from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai

router = APIRouter()

class DocumentRequest(BaseModel):
    title: str
    description: str
    tone: str = "professional"
    format: str = "pdf"   # pdf | markdown | plain

class DocumentResponse(BaseModel):
    content: str
    format: str

@router.post("/generate", response_model=DocumentResponse)
async def generate_document(payload: DocumentRequest):
    """
    Generate document using OpenAI or any LLM.
    Supports: pdf, markdown, plain text output.
    """

    prompt = f"""
    Generate a {payload.tone} document.

    Title: {payload.title}
    Description: {payload.description}

    Output Format: {payload.format}
    """

    try:
        # Replace with your model (OpenAI / Llama / Groq / etc)
        completion = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "You generate documents."},
                      {"role": "user", "content": prompt}]
        )
        text = completion.choices[0].message["content"]

        return DocumentResponse(content=text, format=payload.format)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
