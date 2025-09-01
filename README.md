# Video Games Catalog

A full-stack web application for managing a video games catalog with browsing and editing capabilities.

### Backend
- **ASP.NET Core 8.0** - Web API
- **Entity Framework Core** - ORM with Code First approach
- **SQL Server 2022 Express** - Database
- **NUnit + Moq + AutoFixture** - Unit testing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **SQL Server 2022** - Database container

## 🛠️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (for local development)
- [Node.js 20+](https://nodejs.org/) (for local development)
- [Git](https://git-scm.com/)

## 🚀 Quick Start with Docker (This step is required for creating SQL Server 2022 Exress in a separate container for Local Development Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/dranhovskyi/video-games-catalogue.git
cd video-games-catalogue
```

### 2. Start All Services
```bash
# Build and start all containers
docker-compose up --build
```

### 3. Access the Application
- **Frontend**: https://localhost:55028
- **Backend API Swagger UI**: http://localhost:55027/swagger/index.html

### 4. Stop the Application
```bash
docker-compose down
```

## 🔧 Local Development Setup (Please proceed with Quick Start with Docker first to laucnh a SQL Server in container for  local development)

### Backend and Frontend Setup
- Open Visual Studio

- Clean and Build the solution

- Select VideoGamesCatalogue.Server as a Start Up Project

- Run https configurations -> this will launch Backend and Frontend applications:

- **Frontend**: http://localhost:5173/

- **Backend API Swagger UI**: https://localhost:7294/swagger/index.html 


### Frontend Debug
- Keep running Backend API and shutdown Frontend process http://localhost:5173/
- Open videogamescatalogue.client Visual Studio Code after launching Backend API and press F5
- This will laucnh frontend in Debug mode on http://localhost:5173/

### Running Unit Tests
Right click on VideoGamesCatalogue.Server.UnitTests -> Run Tests


## 🗄️ Database

### Connection Details for DB 
- **Server**: localhost,1433
- **Database**: master
- **Username**: sa
- **Password**: 0BEG9se8BAoNtR0umpHR

