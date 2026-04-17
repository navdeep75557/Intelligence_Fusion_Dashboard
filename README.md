# Intelligence Fusion Dashboard

A modern geospatial intelligence workspace built with React, Tailwind CSS, Framer Motion, and Leaflet.

This project visualizes multi-source intelligence feeds such as **OSINT**, **HUMINT**, and **IMINT** inside a responsive analyst-style dashboard with interactive map exploration, upload parsing, filtering, and rich popup details.

## Overview

The **Intelligence Fusion Dashboard** is designed to feel like a professional analyst tool rather than a generic demo. It combines:

- a full-screen interactive map centered on India
- color-coded intelligence nodes by source type
- animated popup cards with descriptions and image previews
- drag-and-drop ingestion for JSON, CSV, and JPG evidence
- a collapsible sidebar for search, filtering, and quick navigation
- a modern dark UI with smooth motion and deploy-ready structure

## Features

- **Interactive Map**
  Leaflet-powered dark map with smooth pan and zoom behavior.

- **Multi-Source Visualization**
  Distinct visual treatment for OSINT, HUMINT, and IMINT nodes.

- **Rich Intelligence Popups**
  Marker click reveals a modern popup card with title, description, type, timestamp, and optional image preview.

- **Upload Workflow**
  Supports drag-and-drop uploads for:
  - `.json`
  - `.csv`
  - `.jpg` / `.jpeg`

- **Analyst Sidebar**
  Collapsible left panel with:
  - intelligence entry list
  - source filters
  - timeline filter
  - search by title or location

- **Responsive UI**
  Desktop-first design that still adapts cleanly for smaller screens.

- **Production-Ready Frontend**
  Clean component structure, reusable utilities, and Vite-based deployment workflow.

## Tech Stack

- **React**
- **Vite**
- **Tailwind CSS**
- **Leaflet**
- **React Leaflet**
- **Framer Motion**
- **Papa Parse**
- **Lucide React**

## Project Structure

```text
src/
  components/
    MapView.jsx
    Sidebar.jsx
    UploadDropzone.jsx
  data/
    mockIntel.js
  utils/
    constants.js
    parsers.js
  App.jsx
  main.jsx
  styles.css
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```bash
http://127.0.0.1:5173/
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Supported Data Format

Uploaded JSON or CSV entries should include fields like:

```json
{
  "title": "Runway Expansion Imagery",
  "description": "Overhead imagery shows new grading activity.",
  "type": "IMINT",
  "latitude": 25.5941,
  "longitude": 85.1376,
  "location": "Patna Airfield",
  "timestamp": "2026-04-15T05:20:00Z",
  "source": "Satellite pass 4B",
  "image": "runway.jpg"
}
```

Accepted intelligence types:

- `OSINT`
- `HUMINT`
- `IMINT`

## Design Goals

- clean and professional analyst experience
- high readability under dense data conditions
- minimal friction for uploads and exploration
- fast local iteration and easy deployment

## Deployment

This project is ready to deploy on platforms like **Vercel**.

Recommended build settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Future Improvements

- marker clustering for dense regions
- alternate basemap styles
- saved sessions or exportable intelligence snapshots
- time-range playback controls
- live feed integration from backend services

## Repository Notes

- `node_modules` and `dist` are excluded from version control
- mock intelligence data is included for immediate local testing
- no backend is required for the current version

## License

This project is currently provided without a formal license. Add one if you plan to distribute or open-source it publicly.
