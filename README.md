# Kubernetes Monitoring & Project Management Frontend

## Overview
This is a production-grade frontend application built with React, TypeScript, and Tailwind CSS, inspired by GitLab's design. It provides Kubernetes resource monitoring (e.g., Pods, Nodes, Deployments) and project management features (e.g., creating, updating, and deleting Groups, Projects, and Users).

## Features
- **Kubernetes Monitoring**: Real-time display of Kubernetes resource status (CPU, memory, storage, etc.).
- **Project Management**: CRUD operations for Groups, Projects, and Users.
- **Responsive Design**: Modern, responsive UI using Tailwind CSS, inspired by GitLab's clean style.
- **TypeScript Support**: Ensures type safety and improves development efficiency.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend API**: RESTful API (ensure backend is configured)
- **Design Inspiration**: GitLab UI/UX

## Installation & Setup

### Prerequisites
- Node.js (recommended: v18.x or higher)
- npm or yarn
- Backend API service

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root and set the backend API URL:
   ```env
   REACT_APP_API_URL=http://your-backend-api-url
   ```

4. **Start the Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and visit `http://localhost:3000`.

## Usage
1. **Resource Monitoring**:
   - Navigate to the "Resource Monitoring" page to view real-time Kubernetes cluster status.
   - Filter specific resources (e.g., Pods or Nodes) and inspect detailed metrics.
2. **Project Management**:
   - Go to the "Project Management" page to create new Groups or Projects.
   - Edit or delete existing Users and manage permissions.
3. **API Integration**:
   - Ensure the backend API is properly set up for seamless frontend integration.

## Project Structure
```
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components (e.g., Resource Monitoring, Project Management)
│   ├── api/            # API call logic
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # Custom Tailwind CSS styles
│   └── App.tsx         # Main application entry point
└── README.md           # This file
```

## Next Steps
- Implement advanced filtering (e.g., by Namespace for Kubernetes resources).
- Add charts (e.g., using Chart.js) to visualize resource usage.
- Optimize Tailwind CSS configuration for faster load times.

## Issues & Support
If you encounter issues, verify the backend API configuration or submit an issue to the project repository.