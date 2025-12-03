# Developer Tools Platform - Backend

A FastAPI-based backend for a comprehensive developer tools platform.

## Features

### AI-Powered Tools
- AI Document Generator (PDF/Markdown/Text)
- AI Commit Message Generator
- AI Pull Request Summary

### Developer Utilities
- Password Strength Checker
- Password Generator
- UUID Generator (v4)
- Color Picker & Converter (HEX/RGB/HSL)
- Color Palette Generator
- JSON Formatter & Validator
- JSON Diff Tool
- CSV to JSON Converter

### File & Media Tools
- PDF Tools (merge, split, to-text, from-text)
- Image Converter (PNG/JPG/WebP with resizing)
- Video to GIF Converter
- OCR Tools (image, PDF, video frame)

### Network Tools
- Ping Tool
- Traceroute Tool
- IP Lookup
- CURL Command Builder

### HAR Tools
- HAR File Viewer & Parser

## Setup

### Prerequisites
- Python 3.10+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. (Optional) Add your OpenAI API key to `.env` for AI features:
```
OPENAI_API_KEY=your_key_here
```

### Running the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## API Documentation

All API endpoints are documented with OpenAPI (Swagger). Visit `/api/docs` for interactive documentation.

### Example Endpoints

- `POST /api/v1/ai/document/generate` - Generate AI document
- `POST /api/v1/utils/password/check` - Check password strength
- `GET /api/v1/utils/uuid/generate?count=5` - Generate UUIDs
- `POST /api/v1/file/pdf/merge` - Merge PDF files
- `POST /api/v1/network/ping` - Ping a host

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config/              # Configuration & settings
│   ├── core/                # Middleware & exceptions
│   ├── models/              # Pydantic models
│   ├── services/            # Business logic
│   └── api/v1/             # API endpoints
│       ├── ai/             # AI tool endpoints
│       ├── utils/          # Utility endpoints
│       ├── file/           # File processing endpoints
│       ├── network/        # Network tool endpoints
│       └── har/            # HAR tool endpoints
├── requirements.txt
├── .env.example
└── README.md
```

## Notes

- AI features work with or without API keys (mock data is provided)
- Network tools (ping, traceroute) require appropriate system permissions
- OCR features require tesseract to be installed on the system
- Video processing requires ffmpeg to be installed

## License

MIT
