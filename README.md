# LETLABE PROJECT
## Overview
LetLabe is a full-stack web application designed to provide a platform for solving coding problems, managing playlists, and executing code. It features a React-based frontend and an Express.js backend with Prisma as the ORM for database interactions.

# Features
## Frontend
- React Application: Built with React and Vite for fast development and optimized performance.
- Routing: Utilizes react-router-dom for client-side routing.
- UI Components: Includes reusable UI components such as buttons, forms, and cards.
- State Management: Uses zustand for managing authentication state.
- Validation: Implements zod for form validation.
## Backend
- Express.js Server: Handles API requests and serves the application.
- Prisma ORM: Manages database interactions with a PostgreSQL database.
- Authentication: Includes user authentication and authorization.
- Code Execution: Integrates with Judge0 API for code execution and result validation.
- Playlists: Allows users to create and manage playlists of coding problems.
Swagger Documentation: Provides API documentation using Swagger.
## Database
- PostgreSQL: Stores user data, problems, submissions, and playlists.
Prisma Schema: Defines models for User, Problem, Submission, Playlist, and more.
# Project Structure
## Client
- main.jsx: Entry point for the React application.
- src/components: Contains reusable UI components.
- src/page: Includes pages like Dashboard and Landing.
- src/store: Manages application state using zustand.
- src/validators: Contains validation schemas using zod.
## Server
- app.js: Configures the Express server and middleware.
- src/controller: Contains controllers for handling API logic (e.g., auth.controller.js, execute.controller.js).
- src/routes: Defines API routes (e.g., auth.routes.js, problem.routes.js).
- src/utils: Utility functions for error handling, schema validation, and more.
- src/validation: Includes validation schemas for API requests.
- schema.prisma: Defines the database schema.
# Installation

## Clone the repository:

Navigate to the project directory:
Install dependencies for both client and server:
Set up environment variables:
Create a .env file in the server directory with the following variables:
Run database migrations:

## Start the development servers:


```Access the application at http://localhost:5173.```
```Use the Swagger documentation at http://localhost:3000/api-docs to explore the API.```
License
This project is licensed under the MIT License.
