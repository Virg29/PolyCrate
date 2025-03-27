# PolyCrate

A full-stack application for managing files and versions with collaborative features.

### Backend Technologies
[![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

### Frontend Technologies
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

### Core Technologies
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)

## Description

PolyCrate is a modern file management system that allows users to:
- Create and manage projects with versioning
- Upload and preview various file types (images, PDFs, STL files, Excel, Word documents)
- Collaborate with team members
- Track file versions and changes
- Tag projects for better organization

## Tech Stack

### Backend
- NestJS
- PostgreSQL with Prisma ORM
- JWT authentication
- Swagger API documentation
- Express with compression

### Frontend
- React with Vite
- TypeScript
- React Router for navigation
- File preview capabilities for multiple formats
- CSS Modules for styling
- Responsive design with CSS Grid/Flexbox

## Prerequisites

- Node.js (>= 18)
- PostgreSQL
- pnpm package manager

## Project Structure

```
├── app/                   # Backend NestJS application
│   ├── prisma/           # Database schema and migrations
│   └── src/              # Backend source code
├── frontend/             # Frontend React application
│   ├── public/           # Static assets
│   └── src/              # Frontend source code
└── types/                # Shared TypeScript types
```

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables:
   ```
   DATABASE_URL_APP="postgresql://user:password@127.0.0.1:5432/postgres"
   VITE_PORT=5173
   APP_CORS='http://127.0.0.1:5173,http://localhost:5173'
   VITE_API_URL='http://127.0.0.1:3000'
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Initialize the database:
   ```bash
   cd app
   pnpm prisma migrate dev
   pnpm prisma:seed
   ```

5. Start the development servers:
   - Backend:
     ```bash
     cd app
     pnpm start:dev
     ```
   - Frontend:
     ```bash
     cd frontend
     pnpm dev
     ```

Visit `http://localhost:5173` to access the application.

## Features

- **User Authentication**: Secure login system with role-based access control
- **Project Management**: Create, edit, and organize projects
- **Version Control**: Track file changes with versioning support
- **File Preview**: Built-in preview support for:
  - Images
  - PDFs
  - STL (3D models)
  - Excel spreadsheets
  - Word documents
  - Text files
- **Collaboration**: Add team members to projects
- **Project Tagging**: Organize projects with custom tags
- **API Documentation**: Swagger UI available at `/api`

## Initial Seeded Data

The application comes with pre-configured data after running `pnpm prisma:seed`:

### User Roles
- **Admin**: Full system access and management capabilities
- **Maker**: Can create and manage projects
- **User**: Basic access with viewing capabilities

### Default Admin Account
- **Email**: admin@owner.com
- **Password**: 123qwerty!
- **Role**: Admin

You can use these credentials to log in and start using the application immediately after setup.

⚠️ **Security Note**: Remember to change the default admin password in production environments.

## Scripts

### Backend
- `pnpm start:dev` - Start development server
- `pnpm build` - Build for production
- `pnpm prisma:seed` - Seed database with initial data

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm check:types` - Check TypeScript types

## License

This project is licensed under the Creative Commons BY-NC (CC BY-NC 4.0) License.