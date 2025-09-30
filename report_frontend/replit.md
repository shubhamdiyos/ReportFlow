# Overview

This is a GitHub reporting and analytics web application called "ReportFlow" that provides comprehensive insights into development team performance, repository activity, and project metrics. The application features a modern dashboard interface for visualizing GitHub data, managing teams and developers, generating reports, and administering organizational settings. It's designed to help organizations track developer productivity, monitor repository health, and generate actionable insights from their GitHub activities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable interface components
- **Styling**: Tailwind CSS with CSS variables for consistent theming and dark/light mode support
- **State Management**: 
  - React Query (TanStack Query) for server state management and caching
  - React Context for authentication state and theme management
- **Form Handling**: React Hook Form with Zod validation schemas
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage) and PostgreSQL schema definition
- **Development**: Hot module replacement with Vite integration for seamless full-stack development

## Authentication & Authorization
- **Strategy**: Context-based authentication system with role-based access control
- **Roles**: Developer, Manager, and Admin roles with different permission levels
- **Session Management**: Designed for GitHub OAuth integration (currently using demo authentication)

## Database Design
- **Schema**: PostgreSQL with Drizzle ORM migrations
- **Tables**: Users table with username/password authentication
- **Type Safety**: Drizzle-Zod integration for runtime validation of database schemas

## Component Architecture
- **Layout System**: App shell pattern with collapsible sidebar navigation, top navbar, and mobile-responsive design
- **Page Structure**: Feature-based page organization (Dashboard, Teams, Developers, Reports, Repositories, Admin, Settings)
- **Reusable Components**: Modular UI components with consistent design patterns and accessibility features
- **Theme System**: CSS variables-based theming with light/dark mode toggle and persistent preferences

## Development Workflow
- **Monorepo Structure**: Shared types and schemas between client and server
- **Type Safety**: End-to-end TypeScript with shared interfaces
- **Hot Reloading**: Vite-powered development with runtime error overlays
- **Path Mapping**: Configured aliases for clean imports (@/ for client, @shared for shared code)

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for cloud database connectivity
- **drizzle-orm**: Modern TypeSQL ORM for type-safe database operations
- **@tanstack/react-query**: Powerful data synchronization library for React applications

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: For building type-safe, variant-based component APIs
- **framer-motion**: Animation library for smooth user interactions

## Form and Validation
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation library

## Development Tools
- **vite**: Next-generation frontend build tool
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced IDE integration
- **tsx**: TypeScript execution environment for Node.js

## Database and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **drizzle-kit**: CLI companion for Drizzle ORM migrations and introspection

## Charts and Data Visualization
- **recharts**: Composable charting library built on React components for creating interactive data visualizations

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: Secure, URL-friendly unique string ID generator
- **wouter**: Minimalist routing library for React applications