# Task Manager Application

A full-stack task management application built with Spring Boot (Java) backend and React (TypeScript) frontend.

## Features

### Backend
- RESTful API with Spring Boot
- CRUD operations for tasks
- Task status management (TODO, IN_PROGRESS, DONE)
- Input validation
- H2 in-memory database
- Comprehensive error handling
- Unit and integration tests

### Frontend
- React with TypeScript
- Material-UI (MUI) for modern UI components
- Axios for API communication
- Vite for fast development and building
- Task management features:
  - View all tasks
  - Add new tasks
  - Edit tasks (title and description)
  - Delete tasks
  - Update task status
  - Mark tasks as done

## Architecture Decisions

### Persistence Layer Choice: H2 In-Memory Database
I chose H2 in-memory database for the following reasons:
- **Zero Configuration**: No external database setup required
- **Quick Development**: Perfect for demonstrations and development
- **Lightweight**: Minimal resource usage
- **Testing**: Ideal for integration tests
- **Portability**: Application runs anywhere without database dependencies

For production use, this can easily be switched to PostgreSQL, MySQL, or any other JPA-supported database by changing the configuration.

## Prerequisites

- Docker and Docker Compose
- OR
  - JDK 8+ (JDK required, not just JRE)
  - Node.js 18+
  - Gradle (or use the wrapper)

## Important Note

The backend is currently configured for Spring Boot 2.7.17 to maintain compatibility with Java 8. All source files use `javax` imports instead of `jakarta`.

## Quick Start with Docker

1. Clone the repository
2. Navigate to the project root directory
3. Run the application using Docker Compose:

```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api/tasks
   - H2 Console: http://localhost:8080/h2-console

## Manual Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the application:
```bash
./gradlew build
```
(On Windows use `gradlew.bat build`)

3. Run the application:
```bash
./gradlew bootRun
```

The backend will start on http://localhost:8080

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on http://localhost:5173

### Testing Frontend Standalone

To test the frontend UI without the backend:

```bash
cd frontend
npm run dev
```

The frontend will load but API calls will fail until the backend is running.

## Running Tests

### Backend Tests

Navigate to the backend directory and run:

```bash
./gradlew test
```

**Note**: Tests require JDK (not JRE). If you encounter "Could not find tools.jar" error, ensure you have JDK installed and JAVA_HOME points to JDK directory.

This will run:
- Unit tests for the service layer
- Integration tests for the REST controller

### View Test Results

Test reports are generated at:
- `backend/build/reports/tests/test/index.html`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks` | Get all tasks |
| GET    | `/api/tasks/{id}` | Get a specific task |
| POST   | `/api/tasks` | Create a new task |
| PUT    | `/api/tasks/{id}` | Update a task |
| PATCH  | `/api/tasks/{id}/status` | Update task status |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Request/Response Examples

#### Create Task
```json
POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task manager application"
}
```

#### Update Task Status
```json
PATCH /api/tasks/{id}/status
{
  "status": "IN_PROGRESS"
}
```

## H2 Database Console

When running the backend locally, you can access the H2 console at:
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:taskdb`
- Username: `sa`
- Password: (leave empty)

## Building for Production

### Backend
```bash
cd backend
./gradlew build
java -jar build/libs/task-manager-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# The build output will be in the dist/ directory
```

### Docker Images
```bash
# Build images
docker-compose build

# Run in production mode
docker-compose up -d
```

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskmanager/backend/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── build.gradle
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```