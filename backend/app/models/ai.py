"""Pydantic models for AI tools."""
from pydantic import BaseModel, Field
from typing import Literal, Optional


class DocumentGenerateRequest(BaseModel):
    """Request model for document generation."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    tone: str = Field(default="professional", description="Tone of the document")
    format: Literal["pdf", "markdown", "text"] = Field(default="markdown")


class DocumentGenerateResponse(BaseModel):
    """Response model for document generation."""
    content: str
    format: str
    download_url: Optional[str] = None


class CommitMessageRequest(BaseModel):
    """Request model for commit message generation."""
    diff: Optional[str] = None
    description: str = Field(..., min_length=1)


class CommitMessageResponse(BaseModel):
    """Response model for commit message generation."""
    short_message: str
    extended_message: str
    conventional_format: str


class PRSummaryRequest(BaseModel):
    """Request model for PR summary generation."""
    pr_description: str = Field(..., min_length=1)
    diff: Optional[str] = None


class PRSummaryResponse(BaseModel):
    """Response model for PR summary generation."""
    summary: str
    risks: list[str]
    changes: list[str]
    testing_suggestions: list[str]
