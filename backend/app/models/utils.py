"""Pydantic models for utility tools."""
from pydantic import BaseModel, Field
from typing import Optional


class PasswordCheckRequest(BaseModel):
    """Request model for password strength check."""
    password: str = Field(..., min_length=1)


class PasswordCheckResponse(BaseModel):
    """Response model for password strength check."""
    score: int = Field(..., ge=0, le=100)
    strength: str  # weak, medium, strong, very_strong
    length: int
    has_uppercase: bool
    has_lowercase: bool
    has_numbers: bool
    has_symbols: bool
    entropy: float
    suggestions: list[str]


class PasswordGenerateRequest(BaseModel):
    """Request model for password generation."""
    length: int = Field(default=16, ge=8, le=128)
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True


class PasswordGenerateResponse(BaseModel):
    """Response model for password generation."""
    password: str
    strength_score: int


class ColorConvertRequest(BaseModel):
    """Request model for color conversion."""
    color: str = Field(..., description="Color in HEX, RGB, or HSL format")


class ColorConvertResponse(BaseModel):
    """Response model for color conversion."""
    hex: str
    rgb: str
    hsl: str
    preview_url: Optional[str] = None


class ColorPaletteRequest(BaseModel):
    """Request model for color palette generation."""
    base_color: str
    count: int = Field(default=5, ge=1, le=20)


class ColorPaletteResponse(BaseModel):
    """Response model for color palette generation."""
    shades: list[str]
    tints: list[str]


class JSONValidateRequest(BaseModel):
    """Request model for JSON validation."""
    json_string: str


class JSONValidateResponse(BaseModel):
    """Response model for JSON validation."""
    valid: bool
    formatted: Optional[str] = None
    error: Optional[str] = None


class JSONDiffRequest(BaseModel):
    """Request model for JSON diff."""
    json1: str
    json2: str


class JSONDiffResponse(BaseModel):
    """Response model for JSON diff."""
    added: dict
    removed: dict
    modified: dict
