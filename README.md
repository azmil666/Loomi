<p align="center">
  <img src="docs/assets/loomi-git.webp" alt="Loomi Logo" width="420"/>
</p>

---
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Sharp-Image_Engine-111111?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FastAPI-ML_Service-009688?style=for-the-badge&logo=fastapi" />
</p>
</p>
---

**Loomi** is a modern, dark-themed image toolkit built with a scalable full-stack architecture.

It is designed as a structured, professional-grade image processing platform providing a growing suite of high-performance image tools including conversion, compression, resizing, cropping, metadata removal, and ML-powered background removal.

Currently in active development.

---

## ✨ Current Features

### 🖼 Image Converter
- PNG, JPEG, WebP, AVIF, GIF, TIFF support
- Size comparison (before vs after)
- Memory-based processing
- Strict validation

### 🗜 Image Compressor
- Quality-based compression
- Compression savings percentage
- Real-time processing feedback

### ✂️ Image Cropper
- Crop images to custom dimensions
- Fast in-memory processing using Sharp
- Instant download of cropped image

### 📏 Image Resizer
- Resize images to custom width and height
- Maintains high-quality output
- Supports multiple image formats

### 🔒 Metadata Stripper
- Removes EXIF metadata from images
- Protects privacy (GPS, camera info, timestamps)
- Instant metadata-free image download

### 🎯 Background Removal (ML Powered)
- AI-based subject extraction
- Transparent PNG output
- Python FastAPI microservice
- Node ↔ ML service communication


---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Modular tool-based UI architecture

### Backend (API Layer)
- Express
- TypeScript
- Sharp (image processing engine)
- Multer (memory-based file handling)
- Layered architecture (routes → controllers → services → middleware)
- Axios (internal ML service communication)

### ML Microservice
- FastAPI
- Python
- Background removal model
- Isolated microservice architecture

### 📦 Bulk Image Processor
- Process multiple images simultaneously
- Supports compress, resize, convert, and metadata stripping
- Multi-file drag & drop upload
- Dynamic operation controls
- Downloads processed images as a ZIP archive

---

## 🧱 Project Structure

```

Loomi/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── convert.routes.ts
│   │   │   ├── compress.routes.ts
│   │   │   ├── crop.routes.ts
│   │   │   ├── resize.routes.ts
│   │   │   ├── stripMetadata.routes.ts
│   │   │   ├── background.routes.ts
│   │   │   └── bulk.routes.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── convert.controller.ts
│   │   │   ├── compress.controller.ts
│   │   │   ├── crop.controller.ts
│   │   │   ├── resize.controller.ts
│   │   │   ├── stripMetadata.controller.ts
│   │   │   ├── background.controller.ts
│   │   │   └── bulk.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── convert.service.ts
│   │   │   ├── compress.service.ts
│   │   │   ├── crop.service.ts
│   │   │   ├── resize.service.ts
│   │   │   ├── stripMetadata.service.ts
│   │   │   ├── background.service.ts
│   │   │   └── bulk.service.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── upload.middleware.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── tools/
│   │   │       ├── converter/
│   │   │       ├── compressor/
│   │   │       ├── crop/
│   │   │       ├── resize/
│   │   │       ├── strip-metadata/
│   │   │       ├── background-removal/
│   │   │       └── bulk/
│   │   │ 
│   │   ├── components/
│   │   │   ├── tools/
│   │   │   │   ├── ConverterTool.tsx
│   │   │   │   ├── CompressorTool.tsx
│   │   │   │   ├── CropTool.tsx
│   │   │   │   ├── ResizeTool.tsx
│   │   │   │   ├── MetadataStripperTool.tsx
│   │   │   │   ├── BackgroundRemovalTool.tsx
│   │   │   │   └── BulkTool.tsx
│   │   │   │
│   │   │   └── ui/
│   │   │
│   │   └── lib/
│   │
│   └── package.json
│
└── ml-service/
    ├── app.py
    └── requirements.txt
    
    
```

The backend follows a scalable layered architecture to allow future expansion (compressor, background remover, metadata tools, etc.).

---

## 🚀 Running Locally

Loomi uses a microservice architecture.
You must run **three services** in separate terminals.

---

### 1️⃣ ML Service (Background Removal)

```bash
cd ml-service

# create virtual environment (first time only)
python -m venv venv

# activate environment
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# start FastAPI server
uvicorn app:app --reload --port 8000
```

Runs on:

```
http://localhost:8000
```

Swagger docs:

```
http://localhost:8000/docs
```

---

### 2️⃣ Backend API (Express)

```bash
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## ✅ Required Order

Start services in this order:

1. ML service
2. Backend
3. Frontend

If the ML service is not running, background removal will return a 500 error.


---

## 📌 Roadmap

Loomi is being developed as a growing collection of high-performance image tools.  
The goal is to continuously expand the platform with new utilities for developers, creators, and everyday users.

### ✅ Implemented Tools

* [x] Image Converter
* [x] Image Compressor
* [x] Image Cropper
* [x] Image Resizer
* [x] Metadata Stripper
* [x] Background Remover (ML Powered)
* [x] Bulk Image Processing

### 🔜 Upcoming Tools

* [ ] Batch Format Conversion
* [ ] Image Watermarking
* [ ] Image Format Optimizer
* [ ] Image Color Adjustments
* [ ] EXIF Metadata Viewer
* [ ] Smart Image Upscaling (AI)

### 🚀 Platform Expansion

* [x] Drag & Drop multi-file processing
* [ ] Public Loomi deployment
* [ ] Developer API
* [ ] CLI interface
* [ ] Plugin-based tool architecture

---

## 🎯 Vision

Loomi aims to become a modern, developer-grade image toolkit with:

- Clean architecture
- Strong validation
- Performance-focused processing
- ML-powered extensibility
- Microservice-ready backend
- Premium UI experience

This is not just an image tool — it is a modular image processing platform.


---

## 📄 License

MIT

---
