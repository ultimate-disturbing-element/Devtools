"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.core.middleware import ErrorHandlerMiddleware, RequestLoggingMiddleware

# Import routers
from app.api.v1.ai import document, commit, pr_summary
from app.api.v1.utils import password, uuid_gen, color, json_tools, csv_json
from app.api.v1.network import ping, traceroute, ip_lookup, curl_builder
from app.api.v1.file import pdf, image, video, ocr
from app.api.v1.har import parser

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A comprehensive cloud-ready developer tools platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(ErrorHandlerMiddleware)
app.add_middleware(RequestLoggingMiddleware)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/api/docs"
    }


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Include AI tool routers
app.include_router(
    document.router,
    prefix=f"{settings.api_v1_prefix}/ai/document",
    tags=["AI Tools - Document Generator"]
)
app.include_router(
    commit.router,
    prefix=f"{settings.api_v1_prefix}/ai/commit",
    tags=["AI Tools - Commit Message"]
)
app.include_router(
    pr_summary.router,
    prefix=f"{settings.api_v1_prefix}/ai/pr",
    tags=["AI Tools - PR Summary"]
)

# Include utility tool routers
app.include_router(
    password.router,
    prefix=f"{settings.api_v1_prefix}/utils/password",
    tags=["Utils - Password Tools"]
)
app.include_router(
    uuid_gen.router,
    prefix=f"{settings.api_v1_prefix}/utils/uuid",
    tags=["Utils - UUID Generator"]
)
app.include_router(
    color.router,
    prefix=f"{settings.api_v1_prefix}/utils/color",
    tags=["Utils - Color Tools"]
)
app.include_router(
    json_tools.router,
    prefix=f"{settings.api_v1_prefix}/utils/json",
    tags=["Utils - JSON Tools"]
)
app.include_router(
    csv_json.router,
    prefix=f"{settings.api_v1_prefix}/utils/csv",
    tags=["Utils - CSV Converter"]
)

# Include network tool routers
app.include_router(
    ping.router,
    prefix=f"{settings.api_v1_prefix}/network/ping",
    tags=["Network - Ping"]
)
app.include_router(
    traceroute.router,
    prefix=f"{settings.api_v1_prefix}/network/traceroute",
    tags=["Network - Traceroute"]
)
app.include_router(
    ip_lookup.router,
    prefix=f"{settings.api_v1_prefix}/network/ip",
    tags=["Network - IP Lookup"]
)
app.include_router(
    curl_builder.router,
    prefix=f"{settings.api_v1_prefix}/network/curl",
    tags=["Network - CURL Builder"]
)

# Include file processing routers
app.include_router(
    pdf.router,
    prefix=f"{settings.api_v1_prefix}/file/pdf",
    tags=["File - PDF Tools"]
)
app.include_router(
    image.router,
    prefix=f"{settings.api_v1_prefix}/file/image",
    tags=["File - Image Converter"]
)
app.include_router(
    video.router,
    prefix=f"{settings.api_v1_prefix}/file/video",
    tags=["File - Video Tools"]
)
app.include_router(
    ocr.router,
    prefix=f"{settings.api_v1_prefix}/file/ocr",
    tags=["File - OCR Tools"]
)

# Include HAR tool router
app.include_router(
    parser.router,
    prefix=f"{settings.api_v1_prefix}/har",
    tags=["HAR - File Viewer"]
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
