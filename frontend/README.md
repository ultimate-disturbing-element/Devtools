# Developer Tools Platform - Frontend

A Next.js 14 frontend for the Developer Tools Platform with 21+ utilities.

## Features

Built with:
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **TanStack Query** for data fetching
- **next-themes** for dark/light mode

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── providers.tsx        # React Query & Theme providers
│   └── tools/               # Tool pages
│       ├── ai-document/
│       ├── json-formatter/
│       ├── password-strength/
│       ├── uuid-generator/
│       └── ...
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Sidebar, Navbar
│   └── theme-toggle.tsx     # Dark/light mode toggle
├── lib/
│   ├── api.ts               # Axios API client
│   └── utils.ts             # Utility functions
└── package.json
```

## Available Tools

The sidebar provides navigation to all 21+ tools organized by category:

### AI Tools
- AI Document Generator
- AI Commit Message Generator
- PR Summary Generator

### Utilities
- Password Strength Checker
- Password Generator
- UUID Generator
- Color Picker & Converter
- JSON Formatter & Validator
- JSON Diff
- Text Diff
- CSV to JSON Converter

### File & Media
- PDF Tools (merge, split, convert)
- Image Converter
- Video to GIF
- OCR Tools

### Network
- Ping Tool
- Traceroute
- IP Lookup
- CURL Command Builder

### Other
- HAR File Viewer
- Responsive Design Tester

## Building

```bash
npm run build
npm start
```

## Example Tool Pages

The following tools are fully implemented as examples:
- **JSON Formatter** - Real-time validation and formatting
- **UUID Generator** - Batch generation with copy functionality
- **Password Strength Checker** - Real-time analysis
- **AI Document Generator** - AI-powered content generation

These serve as templates for implementing the remaining tools.

## Adding New Tools

1. Create a new page in `app/tools/[tool-name]/page.tsx`
2. Add the route to `components/layout/sidebar.tsx`
3. Use existing tool pages as templates
4. Connect to backend API via `lib/api.ts`

## License

MIT
