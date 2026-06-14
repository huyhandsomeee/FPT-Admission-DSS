# Project Template

> **Mô tả ngắn về dự án của bạn ở đây.**

## Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Security JWT, JPA, MySQL
- **Frontend**: React 18, Vite, Tailwind CSS
- **DevOps**: Docker, GitHub Actions (CI/CD)

## Cấu trúc dự án

```
.
├── backend/          # Spring Boot API + business logic
├── frontend/         # React + Vite frontend
├── deploy/           # Production environment files & scripts
└── .github/          # CI/CD workflows
```

## Chạy local

### 1. Backend

Yêu cầu: **Java 17+**, **MySQL 8**

Tạo database:

```sql
CREATE DATABASE your_db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cấu hình biến môi trường trong `backend/.env` (xem `backend/.env.example`).

Chạy backend:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Backend mặc định: http://localhost:8081

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định: http://localhost:5173

## CI/CD

Pipeline ở `.github/workflows/` gồm các job:
1. **Frontend Quality**: npm ci, lint, build
2. **Backend Quality**: Maven build với MySQL service
3. **Build & Push Images**: build/push Docker images lên Docker Hub
4. **Deploy**: SSH vào server, pull image, up docker compose

### GitHub Secrets cần thiết

| Secret | Mô tả |
|--------|-------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `SSH_HOST` | IP/hostname của server |
| `SSH_USER` | SSH username |
| `SSH_PRIVATE_KEY` | SSH private key |
| `SSH_PORT` | SSH port (mặc định 22) |
| `DEPLOY_PATH` | Thư mục chứa docker-compose trên server |
| `HEALTHCHECK_URL` | URL để kiểm tra sau khi deploy |

## Deploy thủ công

```bash
cd <DEPLOY_PATH>
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans
```
