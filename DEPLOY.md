# Deploying Stock Trading Platform for Free

This guide explains how to deploy the **Backend** to **Render** and the **Frontend** to **Vercel** for free.

## 1. Prerequisites

- **GitHub Account**: Your project must be pushed to GitHub (already done).
- **Render Account**: Example: [Render.com](https://render.com) (for Backend & DB).
- **Vercel Account**: Example: [Vercel.com](https://vercel.com) (for Frontend).

## 2. Deploy Backend (Render)

1.  **Create New Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Settings**:
    - **Runtime**: Python 3
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `./render_start.sh`
4.  **Environment Variables**:
    - `PYTHON_VERSION`: `3.11.9`
    - `SECRET_KEY`: (Generate a random string)
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: `*` (or your render URL)
    - `DATABASE_URL`: (See Database section below)
5.  **Database**:
    - Create a **PostgreSQL** database on Render (or Neon.tech).
    - Copy the `Internal Database URL` (if on Render) or `Connection String` (if external).
    - Paste it into the `DATABASE_URL` environment variable in your Web Service settings.
6.  **Deploy**: Click "Create Web Service".

### Post-Deploy Setup
Once deployed, go to the **Shell** tab in Render dashboard and run:
```bash
python manage.py migrate
python manage.py seed_stocks
python manage.py createsuperuser
```

## 3. Deploy Frontend (Vercel)

1.  **New Project** on Vercel.
2.  Import your GitHub repository.
3.  **Settings**:
    - **Framework Preset**: Vite (should detect automatic).
    - **Root Directory**: `client` (Important! Click "Edit" next to Root Directory and select the `client` folder).
4.  **Environment Variables**:
    - `VITE_API_URL`: (Paste your Render Backend URL here, e.g., `https://my-stock-app.onrender.com/api/`)
        - **Note**: Ensure it ends with a slash `/`.
5.  **Deploy**: Click "Deploy".

## 4. Final Config

- Go back to Render Backend settings.
- Update `CORS_ALLOWED_ORIGINS` (if you set it) or ensure `CORS_ALLOW_ALL_ORIGINS = True` (configured by default for now) to allow your Vercel frontend to connect.


## 5. Troubleshooting (IMPORTANT)

### "Registration Failed" on Mobile/Other Devices?
If it works on your PC but fails on other devices, it means Vercel is still trying to connect to `localhost`.

**You MUST Redeploy Vercel after adding Environment Variables:**
1.  Go to Vercel Dashboard -> Deployments.
2.  Click the three dots `...` next to the latest deployment.
3.  Click **Redeploy**.
4.  Wait for it to finish.

**Why?** Vercel bakes environment variables into the code *at build time*. If you added the variable after the build finished, the code doesn't know about it yet.

### "Server Error" (500)?
Did you run the `./render_start.sh` command in the Render "Start Command" setting? If not, your database is empty. See Step 2.

