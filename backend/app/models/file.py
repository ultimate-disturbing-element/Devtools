"""Pydantic models for file processing tools."""
from pydantic import BaseModel, Field
from typing import Optional


class HARRequest(BaseModel):
    """Model for a single HAR request."""
    url: str
    method: str
    status: int
    size: int
    time: float
    headers: dict[str, str]


class HARParseResponse(BaseModel):
    """Response model for HAR file parsing."""
    requests: list[HARRequest]
    total_requests: int
    total_size: int
    total_time: float
