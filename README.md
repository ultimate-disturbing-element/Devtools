# Developer Tools Web Platform

A comprehensive, cloud-ready, modular developer tools platform with 21+ utilities for AI, coding, file processing, and networking tasks.

## 🎯 Overview

This full-stack platform provides developers with essential tools in a single, modern web application:

- **Backend**: FastAPI (Python 3.10+) with auto-generated OpenAPI docs
- **Frontend**: Next.js 14 with App Router, Tailwind CSS, and shadcn/ui
- **Architecture**: Clean, modular, API-first design

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run server
uvicorn app.main:app --reload
```

Backend will run at http://localhost:8000

API Docs available at http://localhost:8000/api/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Run development server
npm run dev
```

Frontend will run at http://localhost:3000

## 🧰 Tools Included

### AI-Powered Tools (3)
- **AI Document Generator** - Generate PDF/Markdown/Text documents
- **AI Commit Message Generator** - Create conventional commit messages
- **AI PR Summary** - Summarize pull requests with risks and testing suggestions

### Developer Utilities (9)
- **Password Strength Checker** - Analyze password security
- **Password Generator** - Generate secure passwords
- **UUID Generator** - Create UUID v4 identifiers
- **Color Picker** - Convert HEX/RGB/HSL and generate palettes
- **Text Diff** - Side-by-side text comparison
- **JSON Diff** - Compare JSON objects
- **JSON Formatter** - Validate and beautify JSON
- **CSV to JSON** - Convert CSV files to JSON

### File & Media Tools (4)
- **PDF Tools** - Merge, split, extract text, create PDFs
- **Image Converter** - Convert PNG/JPG/WebP with resizing
- **Video to GIF** - Convert videos to animated GIFs
- **OCR Tools** - Extract text from images, PDFs, and videos

### Network Tools (4)
- **Ping** - Ping hosts with statistics
- **Traceroute** - Trace network routes
- **IP Lookup** - Get geolocation and ISP info
- **CURL Builder** - Generate CURL commands

### Other Tools (2)
- **HAR Viewer** - Parse and analyze HAR files
- **Responsive Tester** - Test designs across device sizes

**Total: 21+ Tools**

## 📁 Project Structure

```
devtools-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config/              # Settings & configuration
│   │   ├── core/                # Middleware & exceptions
│   │   ├── models/              # Pydantic models
│   │   ├── services/            # Business logic
│   │   └── api/v1/             # API endpoints
│   │       ├── ai/             # AI tools
│   │       ├── utils/          # Utilities
│   │       ├── file/           # File processing
│   │       ├── network/        # Network tools
│   │       └── har/            # HAR tools
│   ├── requirements.txt
│   └── README.md
│
└── frontend/
    ├── app/
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Homepage
    │   └── tools/               # Tool pages
    ├── components/
    │   ├── ui/                  # shadcn/ui components
    │   └── layout/              # Sidebar & Navbar
    ├── lib/
    │   └── api.ts               # Axios API client
    ├── package.json
    └── README.md
```

## 🔌 API Examples

### AI Document Generator
```bash
POST /api/v1/ai/document/generate
{
  "title": "Project Proposal",
  "description": "A comprehensive project proposal",
  "tone": "professional",
  "format": "markdown"
}
```

### Password Checker
```bash
POST /api/v1/utils/password/check
{
  "password": "MyP@ssw0rd!"
}
```

### UUID Generator
```bash
GET /api/v1/utils/uuid/generate?count=5
```

### PDF Merge
```bash
POST /api/v1/file/pdf/merge
# Upload multiple PDF files
```

## ✨ Features

### Backend
- ✅ FastAPI with automatic OpenAPI documentation
- ✅ Pydantic v2 for data validation
- ✅ Async endpoints for better performance
- ✅ CORS configured for Next.js
- ✅ Custom error handling middleware
- ✅ Modular service architecture
- ✅ Mock AI responses (works without API keys)

### Frontend
- ✅ Next.js 14 App Router
- ✅ Tailwind CSS with custom design system
- ✅ shadcn/ui components
- ✅ Dark/Light theme support
- ✅ TanStack Query for data fetching
- ✅ Responsive sidebar navigation
- ✅ Type-safe with TypeScript

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
OPENAI_API_KEY=your_key_here  # Optional
ANTHROPIC_API_KEY=your_key_here  # Optional
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📝 Implementation Status

### ✅ Fully Implemented
- Complete backend API with 20+ endpoints
- FastAPI app with CORS and middleware
- All service layers (AI, utils, file, network)
- Frontend layout and navigation
- 4 complete example tools:
  - JSON Formatter
  - UUID Generator
  - Password Strength Checker
  - AI Document Generator

### 🚧 Template Available (Need Page Creation)

The following tools have working backend APIs and just need frontend pages created (use the 4 examples as templates):

- Password Generator
- Color Picker
- Text Diff
- JSON Diff
- CSV to JSON
- AI Commit Message
- AI PR Summary
- PDF Tools
- Image Converter
- Video to GIF
- OCR Tools
- Ping
- Traceroute
- IP Lookup
- CURL Builder
- HAR Viewer
- Responsive Tester

## 🛠️ Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Building for Production

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## 🚀 Deployment

### Backend
- Deploy on: Railway, Render, AWS Lambda, or any Python hosting
- Set environment variables for API keys
- Use production ASGI server (uvicorn, gunicorn)

### Frontend
- Deploy on: Vercel, Netlify, or any Node.js hosting
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Build command: `npm run build`
- Start command: `npm start`

## 📚 Documentation

- **Backend API Docs**: http://localhost:8000/api/docs (Swagger UI)
- **Backend ReDoc**: http://localhost:8000/api/redoc
- **Component Library**: shadcn/ui documentation

## 🤝 Contributing

1. Use the 4 implemented tools as templates
2. Create new tool pages in `frontend/app/tools/[tool-name]/page.tsx`
3. Connect to existing backend APIs
4. Follow the established patterns for consistency

## 📄 License

MIT

## 👏 Credits

Built with FastAPI, Next.js, Tailwind CSS, and shadcn/ui
