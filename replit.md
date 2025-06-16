# The Scholar - Biblical Study Assistant

## Overview

The Scholar is a comprehensive biblical study assistant application built with modern web technologies. It provides an AI-powered chat interface for biblical questions, integrated Bible reading, note-taking, sermon preparation tools, and a digital library for managing study resources.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TypeScript with tsx for hot reloading

### Design System
- **Theme**: Dark-themed UI with custom color palette
- **Primary Colors**: Scholar Black (`#000000`), Scholar Gold (`#F5C842`)
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with desktop enhancements

## Key Components

### 1. AI Chat Interface (`/`)
- Real-time chat with The Scholar AI powered by Google's Gemini
- Protestant theological framework with pastoral sensitivity
- Spirit-led responses combining multiple theological perspectives
- Suggested questions for sermon prep and biblical study
- Message history persistence
- Contextual responses rooted in biblical scholarship

### 2. Bible Reader (`/bible`)
- Complete Bible text access
- Chapter-by-chapter navigation
- Search functionality across all biblical text
- Bookmarking system for verses and passages

### 3. Note Management (`/notes`)
- Create, edit, and organize study notes
- Link notes to specific scripture references
- Tag system for categorization
- Full-text search capabilities

### 4. Sermon Preparation (`/sermon-prep`)
- Structured sermon outline creation
- Scripture reference integration
- Notes and commentary organization
- Export functionality for final sermons

### 5. Digital Library (`/library`)
- Manage personal study resources
- Categorize books, commentaries, and references
- Search and filter library items
- Integration with note-taking system

## Data Flow

### Database Schema
- **Users**: Authentication and user management
- **Chat Messages**: AI conversation history with responses
- **Notes**: User-created study notes with scripture references
- **Sermons**: Sermon outlines and preparation materials
- **Bookmarks**: Saved Bible verses and passages
- **Library Items**: Personal study resource catalog

### API Structure
- RESTful API design with consistent error handling
- CRUD operations for all major entities
- Type-safe data validation using Zod schemas
- Automatic API request logging and monitoring

### Authentication Flow
- Session-based authentication using Express sessions
- PostgreSQL session store for persistence
- Demo user system for initial development

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18+ with modern hooks and patterns
- **Database**: Drizzle ORM with PostgreSQL driver
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **HTTP Client**: Native fetch API with TanStack Query
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and optimized builds
- **ESBuild**: Production server bundling
- **PostCSS**: CSS processing with Autoprefixer

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google AI (Gemini)**: Powers The Scholar AI with Protestant theological framework
- **IQ Bible API**: Advanced semantic biblical analysis and enhanced scripture search via RapidAPI subscription
- **Complete Study Bible API**: Strong's concordance lookups for original language word studies via RapidAPI subscription

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **Development**: Hot reloading with Vite dev server
- **Production**: Express serves static files and API routes
- **Database**: Connection via `DATABASE_URL` environment variable

### Replit Deployment
- **Auto-scaling**: Configured for Replit's autoscale deployment
- **Port Configuration**: Server runs on port 5000, external port 80
- **Build Process**: `npm run build` followed by `npm run start`

### Development Workflow
- **Hot Reloading**: Frontend and backend changes reload automatically
- **Database Migrations**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript across the project

## Changelog

```
Changelog:
- June 16, 2025: Initial setup
- June 16, 2025: Integrated The Scholar AI with Google Gemini API
  * Added Protestant theological framework system prompt
  * Implemented Spirit-led biblical study responses
  * Updated mobile-responsive design for better usability
  * Added profile icon to header replacing bookmark button
  * Enhanced chat interface with Scholar personality
- June 16, 2025: Integrated IQ Bible API with semantic analysis
  * Connected IQ Bible API subscription for enhanced biblical context
  * Implemented priority system: Scripture text lookup first, then interpretation
  * Added semantic word relationship analysis for biblical terms
  * Enhanced AI responses with authentic Scripture data before interpretation
  * Completed full integration with Protestant theological framework
- June 16, 2025: Added Complete Study Bible API for Strong's concordance
  * Integrated Strong's number lookup (G#### or H####) for original language studies
  * Enhanced AI with automatic word study detection and authentic concordance data
  * Added original Greek/Hebrew words, transliterations, definitions, and KJV translations
  * Combined with IQ Bible API for comprehensive biblical word analysis
  * Added development authentication bypass for easier testing
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```