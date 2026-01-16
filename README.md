# Simple Notes – Final Project (Coding Factory)

This repository contains the final project developed for the **Coding Factory Program (AUEB – ΟΠΑ)**.  
The application is a full-stack web system for managing personal notes, following **Domain-Driven Design**, **layered architecture**, **RESTful principles**, and a complete **Authentication / Authorization system**.

---

## Project Description

The **Simple Notes** application allows users to register, authenticate, and manage personal notes through a web interface.  
The system consists of a **React (TypeScript) frontend** and an **ASP.NET Core Web API backend**.

The project demonstrates:
- Domain modeling
- Model-First database design
- Layered backend architecture
- REST API communication
- Authentication & Authorization (JWT)
- Frontend–Backend integration

---

## Domain Model

The core domain of the application is the **Note** entity.

### Domain Entity
- **Note**
  - Id
  - Title
  - Content
  - CreatedAt
  - UpdatedAt

The database schema is derived from the domain model following a **Model-First approach**.

---

## Architecture

### Backend Architecture (Layered)

The backend follows a **layered architecture**:

- **Controllers Layer**
  - Exposes REST API endpoints
- **Service Layer**
  - Contains business logic
- **Repository Layer**
  - Handles data access
- **Domain / Models**
  - Defines domain entities

This separation improves maintainability, scalability, and testability.

---

## Frontend Architecture

The frontend is implemented using **React with TypeScript** and communicates with the backend via REST API calls.

Responsibilities:
- User interface rendering
- Handling user interactions
- Authentication state management
- API communication

---

## Authentication & Authorization

The application implements a complete **Authentication and Authorization system** on both backend and frontend.

### Backend
- Authentication is implemented using **JWT (JSON Web Tokens)**.
- Users register and authenticate via the Auth API endpoints.
- Protected endpoints require the `Authorization: Bearer <token>` HTTP header.
- Authorization ensures that users can only access their own resources.

### Frontend
- The frontend manages the authentication state of the user.
- JWT tokens are attached to authenticated API requests.
- Unauthorized users are restricted from accessing protected features.

---

## Technology Stack

### Backend
- C#
- ASP.NET Core Web API
- .NET SDK

### Frontend
- React
- TypeScript
- Vite
- npm

### Tooling
- Visual Studio / Visual Studio Code
- Git & GitHub

---

## Project Structure

```text
simple-notes/
├── client - frontend/          # React + TypeScript frontend
├── server-backend/
│   └── SimpleNotes.Api/        # ASP.NET Core Web API
├── .gitignore
├── LICENSE
└── README.md
Prerequisites
Before running the application, ensure the following are installed:

.NET SDK

Node.js & npm

Git

Build & Run Instructions
Clone the Repository
bash
Copy code
git clone https://github.com/panosrodo/simple-notes.git
cd simple-notes
Run the Backend
bash
Copy code
cd "server-backend/SimpleNotes.Api"
dotnet restore
dotnet build
dotnet run
The backend API runs on a local port (e.g. https://localhost:5001)

Swagger documentation is available at /swagger

Run the Frontend
bash
Copy code
cd "client - frontend"
npm install
npm run dev
The frontend runs on a local development server (e.g. http://localhost:5173)

Environment Configuration
The frontend communicates with the backend via environment variables.

Example .env file inside client - frontend:

env
Copy code
VITE_API_BASE_URL=https://localhost:5001
REST API Endpoints
Authentication
POST /api/Auth/register – Registers a new user

POST /api/Auth/login – Authenticates a user and returns a JWT access token

Notes
GET /api/Note – Retrieve all notes of the authenticated user

POST /api/Note – Create a new note

GET /api/Note/{id} – Retrieve a note by ID

PUT /api/Note/{id} – Update an existing note

DELETE /api/Note/{id} – Delete a note

Users
GET /api/Users/me – Retrieve the authenticated user profile

Testing & Documentation
REST API endpoints are documented using Swagger (OpenAPI 3.0)

API behavior can be tested using Swagger UI or Postman

Authentication can be tested by providing the JWT token via the Authorize button in Swagger

Deployment
The application can be deployed by:

Building the backend using dotnet build

Building the frontend using npm run build

Hosting the frontend and backend on a suitable server or cloud platform

License
This project is licensed under the MIT License.
See the LICENSE file for details.