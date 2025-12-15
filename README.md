# Stock Trading Platform

A production-ready full-stack stock trading platform built with Django, React, and Docker.

## Features

- **User Authentication**: Secure Login/Register with JWT.
- **Stock Market**: View real-time (simulated) stock prices.
- **Portfolio Management**: Track your holdings and average buy price.
- **Trading System**: Atomic Buy/Sell transactions with wallet validation.
- **Transaction History**: Detailed record of all trades.
- **Dockerized**: Easy deployment with Docker Compose.

## Tech Stack

- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS, Axios, Recharts
- **DevOps**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local dev)
- Python 3.11+ (for local dev)

### Deployment Prerequisites (Any Server/PC)

To run this project on another system (Windows, Linux, macOS), you **ONLY** need:
1.  **Docker Desktop** (or Docker Engine + Docker Compose Plugin) installed.
2.  **Git** (optional, to clone the repo) or just copy the project folder.

**You do NOT need Python, Node.js, or PostgreSQL installed on the host system.** Docker handles all dependencies.

### How to Run on Another System

1.  **Copy Files**: Transfer this entire project folder to the new system.
2.  **Install Docker**: Ensure Docker is running.
3.  **Start Application**:
    ```bash
    docker-compose up --build -d
    ```
4.  **Access App**:
    - Frontend: `http://localhost`
    - Backend: `http://localhost:8000`

### Post-Deployment Setup (First Time Only)

After starting the containers, you need to set up the database:

1.  **Apply Migrations**:
    ```bash
    docker exec stock_trading_platform-backend-1 python manage.py migrate
    ```
2.  **Seed Initial Data (Stocks)**:
    ```bash
    docker exec stock_trading_platform-backend-1 python manage.py seed_stocks
    ```
3.  **Create Admin User**:
    ```bash
    docker exec -it stock_trading_platform-backend-1 python manage.py createsuperuser
    ```

### Running with Docker

1.  Clone the repository.
2.  Run `docker-compose up --build`.
3.  Access Frontend at `http://localhost`.
4.  Access Backend API at `http://localhost:8000`.

### Local Development

#### Backend
1.  `cd .`
2.  `pip install -r requirements.txt`
3.  `python manage.py migrate`
4.  `python manage.py runserver`

#### Frontend
1.  `cd client`
2.  `npm install`
3.  `npm run dev`

## API Endpoints

- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `GET /api/stocks/` - List Stocks
- `GET /api/portfolio/` - Get User Portfolio
- `POST /api/trade/buy/` - Buy Stock
- `POST /api/trade/sell/` - Sell Stock
- `GET /api/transactions/` - Transaction History
