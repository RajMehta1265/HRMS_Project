# Human Resource Management System (HMRS) — Full-Stack Portal

A modern, full-stack Human Resource Management System (HMRS) featuring a **Spring Boot 3** REST API backend and a responsive **React (Vite + TypeScript)** dashboard frontend.

---

## 🚀 Key Features

### Backend (REST API)
* **Spring Boot 3 & Java 17/22** architecture.
* **Database Support**: Configured for PostgreSQL (production/dev compose) and H2 (testing/local profiles).
* **Data Validations**: Field-level validation constraints via Jakarta validation.
* **CORS Enabled**: Allowed communication from Vite frontend (`http://localhost:5173`).
* **Swagger/OpenAPI 3 Integration**: Interactive endpoint documentation available at `/swagger-ui/index.html`.
* **Testing**: 27 unit & integration tests (JUnit 5, MockMvc) running in a dedicated H2 database test profile.

### Frontend (User Portal)
* **React 18, Vite & TypeScript** boilerplate.
* **Premium Glassmorphic Design**: harmony CSS styling, dark-mode gradients, smooth transitions, and layout micro-animations.
* **Overview KPI Stats**: Live counters for active job ads, registered candidates, corporate partners, and covered cities.
* **Dynamic Modals**: Forms for adding cities, adding job positions, posting jobs, registering employers, and applying for active job postings.
* **Alert Notifications**: Custom green/red success and error notifications synced with backend response models.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Backend Framework** | Spring Boot 3.x, Spring Data JPA |
| **Java Version** | Java 17+ (tested on Java 17 and 22) |
| **Frontend Framework** | React 18, Vite, TypeScript |
| **Database** | PostgreSQL (Production/Docker), H2 (Local/Test Profiles) |
| **Containerization** | Docker, Docker Compose |
| **API Docs** | Springdoc OpenAPI Starter WebMVC UI (Swagger) |
| **Testing** | JUnit 5, MockMvc |
| **Utilities** | Lombok, Jackson, Axios, Lucide Icons |

---

## 📦 Project Structure

```text
├── Dockerfile                  # Multi-stage maven build for Spring Boot application
├── docker-compose.yml          # Orchestrates backend jar and postgres:15 database
├── pom.xml                     # Maven configuration & dependencies
├── src/
│   ├── main/
│   │   ├── java/hrms/hrms/
│   │   │   ├── business/      # Service Layer (Business rules)
│   │   │   ├── controller/    # REST Controllers (API Endpoints)
│   │   │   ├── entity/        # JPA Entities (Database Tables)
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   └── config/        # CORS configurations & Security beans
│   │   └── resources/         # Application properties
│   └── test/                  # 27 Unit and integration tests with H2 database configurations
└── frontend/                   # React + TypeScript User Interface
    ├── src/
    │   ├── components/        # Dashboard layout, Forms, and Modals
    │   ├── services/          # Axios API communication services
    │   └── index.css          # Core custom styling system
    └── package.json           # Node configuration & scripts
```

---

## 🚦 Getting Started

### Prerequisites
* Java Development Kit (JDK 17 or later)
* Node.js (v18 or later) & npm
* Docker & Docker Compose (optional, for database/jar deployments)

---

### Run Locally (Out of the box)

#### 1. Start the Backend Server (with H2 Test profile)
You don't need to manually configure databases to test the app. Run in `test` profile to use H2 in-memory db:
```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=test"
```
* Backend starts at `http://localhost:8080`
* Interactive API Documentation (Swagger UI): `http://localhost:8080/swagger-ui/index.html`

#### 2. Start the Frontend Dev Server
Navigate into the `frontend` folder, install dependencies, and launch Vite:
```powershell
cd frontend
npm install
npm run dev
```
* Frontend starts at `http://localhost:5173`

---

### Run with Docker Compose

Deploy the backend Spring Boot app packaged with a PostgreSQL instance in single command:
```powershell
docker-compose up --build
```
* This compiles the Java jar inside a Docker maven container, pulls PostgreSQL 15, configures the database tables, and binds the services together.

---

## 🧪 Running Tests
To run all 27 unit & integration tests:
```powershell
.\mvnw.cmd test
```
Outputs:
```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 27, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```
