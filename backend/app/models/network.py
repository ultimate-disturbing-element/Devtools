"""Pydantic models for network tools."""
from pydantic import BaseModel, Field
from typing import Optional


class PingRequest(BaseModel):
    """Request model for ping tool."""
    host: str = Field(..., min_length=1)
    count: int = Field(default=4, ge=1, le=10)


class PingResponse(BaseModel):
    """Response model for ping tool."""
    host: str
    packets_sent: int
    packets_received: int
    packet_loss: float
    min_latency: Optional[float] = None
    max_latency: Optional[float] = None
    avg_latency: Optional[float] = None


class TracerouteRequest(BaseModel):
    """Request model for traceroute tool."""
    host: str = Field(..., min_length=1)
    max_hops: int = Field(default=30, ge=1, le=64)


class TracerouteHop(BaseModel):
    """Model for a single traceroute hop."""
    hop_number: int
    ip: Optional[str] = None
    hostname: Optional[str] = None
    latency: Optional[float] = None


class TracerouteResponse(BaseModel):
    """Response model for traceroute tool."""
    host: str
    hops: list[TracerouteHop]


class IPLookupResponse(BaseModel):
    """Response model for IP lookup tool."""
    ip: str
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    isp: Optional[str] = None
    asn: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CURLBuildRequest(BaseModel):
    """Request model for CURL command builder."""
    url: str
    method: str = Field(default="GET")
    headers: dict[str, str] = Field(default_factory=dict)
    body: Optional[str] = None
    auth: Optional[str] = None


class CURLBuildResponse(BaseModel):
    """Response model for CURL command builder."""
    command: str
