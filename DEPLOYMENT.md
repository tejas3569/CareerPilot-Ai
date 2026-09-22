# 🚀 CareerPilot AI — Complete GitHub & Cloud Deployment Guide

This guide covers everything needed to:
1. **Push your code to a new GitHub repository**
2. **Deploy the FastAPI Backend (Render / Railway / Docker)**
3. **Deploy the React Frontend (Vercel / Netlify / GitHub Pages)**
4. **Configure Environment Variables & CORS**

---

## 📦 Step 1: Push Codebase to GitHub

### 1.1 Prerequisites
If `git` is not yet installed on your Windows machine, install it quickly via PowerShell:
```powershell
winget install --id Git.Git -e --source winget
```
*(Or download and install directly from [git-scm.com](https://git-scm.com/download/win) or use [GitHub Desktop](https://desktop.github.com/)).*

After installing, restart your terminal/PowerShell and configure your GitHub username and email:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 Create a New GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click **New Repository** (or visit [github.com/new](https://github.com/new)).
3. Set Repository Name: `careerpilot-ai` (or any name you choose).
4. Choose **Public** or **Private**.
5. **Do NOT** check "Add a README", ".gitignore", or "license" (we already created these files).
6. Click **Create repository**.

### 1.3 Initialize and Push from Local Directory
Open PowerShell in this project folder (`c:\Users\Mi\Documents\New folder (2)`):

```powershell
# 1. Initialize local git repository
git init

# 2. Stage all files (our root .gitignore automatically ignores node_modules, .env, *.db)
git add .

# 3. Create your first commit
git commit -m "feat: Initial release of CareerPilot AI platform"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your GitHub remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/careerpilot-ai.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🌐 Step 2: Deploy Backend to Render (Free & Recommended)

[Render](https://render.com) provides free hosting for Python FastAPI web services linked directly to GitHub.

1. Create a free account at [render.com](https://render.com).
2. From the dashboard, click **New +** ➔ **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `careerpilot-ai` repo.
4. Configure the service settings:
   - **Name**: `careerpilot-api`
   - **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Expand **Advanced** ➔ **Add Environment Variables**:
   | Key | Value | Notes |
   |---|---|---|
   | `SECRET_KEY` | *(generate a random 32+ character string)* | For JWT token signing |
   | `CORS_ORIGINS` | `*` *(or your frontend Vercel URL)* | Allows cross-origin API calls |
   | `LLM_PROVIDER` | `gemini` | `gemini` or `openai` |
   | `GEMINI_API_KEY` | *(your Google Gemini API key)* | Optional; falls back to offline engine |
6. Click **Create Web Service**.
7. Once deployment finishes, copy your live backend URL (e.g., `https://careerpilot-api.onrender.com`).

---

## ⚡ Step 3: Deploy Frontend to Vercel (Free & Instant)

[Vercel](https://vercel.com) is the fastest platform for hosting React + Vite applications.

1. Sign up or log in at [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** ➔ **Project**.
3. Import your `careerpilot-ai` repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Expand **Environment Variables**:
   | Name | Value |
   |---|---|
   | `VITE_API_URL` | `https://careerpilot-api.onrender.com/api` *(Your Render backend URL + `/api`)* |
6. Click **Deploy**.
7. In ~60 seconds, your site will be live at `https://careerpilot-ai.vercel.app`!

---

## 🐳 Step 4: Alternative — Containerized Deployment (Docker)

If you prefer deploying with Docker (e.g., on Railway, Fly.io, AWS ECS, or DigitalOcean):

### Backend Dockerfile:
We included `backend/Dockerfile`. To build and run locally or on a cloud container host:
```bash
cd backend
docker build -t careerpilot-backend .
docker run -p 8000:8000 -e SECRET_KEY="my-secret-key" careerpilot-backend
```

### Full-Stack Docker Compose:
To spin up the entire platform locally with one command:
```bash
docker-compose up --build
```

---

## 🤖 Step 5: Continuous Integration (GitHub Actions)

We have already configured `.github/workflows/ci.yml`. 
Every time you push code or open a pull request to `main`:
- GitHub Actions automatically runs backend `pytest` (11 tests).
- GitHub Actions automatically runs frontend `tsc -b && vite build`.
- You will see a green checkmark `✔` on your GitHub repository!
