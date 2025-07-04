# Task Management Web Application Specification

## 1. Project Overview

### 1.1 Application Name
Task Manager with Subtasks

### 1.2 Purpose
A task management web application that makes it easy to manage subtasks. Efficiently manage tasks by breaking down large tasks into smaller subtasks through a hierarchical task structure.

### 1.3 Key Features
- Create, edit, and delete tasks
- Create, edit, and delete subtasks
- Mark tasks/subtasks as complete
- Reorder by drag and drop
- Export in markdown format
- User management with Google authentication

## 2. Technology Stack

### 2.1 Development Environment
- **IDE**: VSCode + DevContainer
- **Container**: Docker
- **Package Manager**: pnpm
- **Linter/Formatter**: Biome

### 2.2 Frontend
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **CSS Framework**: TailwindCSS
- **Rendering**: SPA (Single Page Application)

### 2.3 Backend
- **Language**: TypeScript
- **Framework**: Fastify
- **Authentication**: JWT (JSON Web Token)

### 2.4 Infrastructure
- **Cloud Platform**: Google Cloud Platform
- **Hosting**: Cloud Run
- **Database**: Cloud Firestore
- **Authentication Provider**: Google OAuth 2.0
- **CI/CD**: GitHub Actions
- **Code Management**: GitHub

## 3. Page Specifications

### 3.1 Home Page (/)
- Display application title
- Google sign-in button only
- Redirect to `/task-list` upon successful sign-in

### 3.2 Task List Page (/task-list)
- Authentication check (redirect to `/` if not authenticated)
- Task list management interface
- Drag and drop to reorder tasks
- Click on tasks or subtasks to edit title and description inline
- Click on due date to select from calendar picker
- Drag and drop to reorder subtasks within tasks
- Subtasks are intended to be completed from top to bottom; the subtask directly below completed subtasks is highlighted as the current subtask
- Complete and uncomplete tasks/subtasks
- Delete tasks/subtasks
- Add new tasks
- Add new subtasks to tasks
- Sign out button