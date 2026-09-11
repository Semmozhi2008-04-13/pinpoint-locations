# Pinpoint Locations

A React + TypeScript web app for saving and managing favorite places on an interactive map.

**Live demo:** https://your-vercel-url.vercel.app
**Repository:** https://github.com/YOUR-USERNAME/pinpoint-locations

---

## Table of contents

- [Overview](#overview)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Features](#features)
- [Architecture](#architecture)
- [Key decisions](#key-decisions)
- [Project structure](#project-structure)
- [Testing checklist](#testing-checklist)
- [Known limitations](#known-limitations)
- [License](#license)

---

## Overview

Pinpoint Locations is a single-page map application that lets you save, organize, and revisit places that matter to you. Click anywhere on the map, give the spot a name and category, mark it as a favorite or as visited, add a personal note — and it's saved instantly, both to the map and to the sidebar.

Everything is client-side. There is no backend, no authentication, and no signup. Saved data lives in your browser's `localStorage` and persists across reloads and browser restarts.

---

## Setup

```bash
# Install dependencies
npm install

# Start the dev server (opens http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Run ESLint
npm run lint
