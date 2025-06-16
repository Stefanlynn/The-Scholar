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
- June 16, 2025: Enhanced Bible reader with NIV Bible API and Bible Search API
  * Integrated NIV Bible API for authentic NIV translation text
  * Added Bible Search API for additional translation support
  * Redesigned mobile Bible page with improved layout and spacing
  * Added verse-level interactive icons (highlight, notes, Scholar AI)
  * Updated navigation buttons to icon-only design
  * Created touch-friendly verse cards with visual feedback
- June 16, 2025: Updated Scholar AI to Kris Vallotton teaching style
  * Reformed Scholar's teaching DNA to be prophetic, empowering, and identity-focused
  * Updated system prompt to speak identity and call out greatness in believers
  * Enhanced study tools to connect every truth to royal identity as children of the King
  * Scholar now bridges truth with tremendous grace while building faith
  * Maintains Protestant theological framework with prophetic yet pastoral tone
- June 16, 2025: Simplified Notes interface by removing AI and share buttons
  * Removed AI enhancement features from note cards for cleaner interface
  * Removed share buttons (copy, email, PDF) to focus on core note functionality
  * Changed journal icon from heart to pen tool for better representation
  * Streamlined note management with edit and delete actions only
- June 16, 2025: Built comprehensive Library page with seven major sections
  * Added Devotionals section with 5-day, 30-day, and topical devotionals with progress tracking
  * Created Bible Reading Plans including chronological, canonical, and teaching prep plans
  * Implemented Teaching & Sermon Resources with outlines, series structures, and communication guides
  * Built Study Tools section with word studies, cross-references, and cultural context articles
  * Added Theology Crash Courses on foundational topics like Trinity, Salvation, Identity in Christ
  * Integrated Audio & Podcast Library for teachings, podcasts, and user-uploaded content
  * Created Saved Content hub for sermon drafts, AI chat notes, study sessions, and favorites
- June 16, 2025: Redesigned Library page with Masterclass/Pray app inspired visual design
  * Removed traditional category tabs in favor of visual content discovery
  * Implemented hero header with gradient background and inspiring messaging
  * Added image-driven featured content cards with progress tracking and hover animations
  * Created Quick Access section with colorful icon cards for immediate actions
  * Built Browse Collections section with horizontal card layouts and content previews
  * Added Recommended content discovery section with beautiful imagery
  * Enhanced visual hierarchy with premium typography and sophisticated card designs
- June 16, 2025: Added proper bottom padding to all pages for mobile navigation compatibility
  * Updated Library, Notes, and Sermon Prep pages with responsive bottom padding
  * Ensured content is fully scrollable and visible above mobile navigation bar
  * Applied pb-20 for mobile (80px) and md:pb-6 for desktop (24px) padding
- June 16, 2025: Implemented comprehensive user profile system with site-wide data integration
  * Created profile button icon in header for easy access across all pages
  * Built UserPreferencesContext to manage user settings and propagate changes
  * Enhanced profile page to invalidate all user-related queries when preferences update
  * Integrated Supabase authentication tokens in API requests for proper user data access
  * Ensured profile changes (Bible translation, dark mode, etc.) update throughout entire application
- June 16, 2025: Enhanced visual design and branding improvements
  * Fixed account settings section with improved dark theme styling and readability
  * Replaced white button boxes with properly styled transparent buttons
  * Added graduation cap hat icon next to "The Scholar" logo in golden color for scholarly branding
  * Removed profile icon from header for cleaner design (profile still accessible via sidebar and mobile navigation)
- June 16, 2025: Built comprehensive Sermon Workspace within Notes page
  * Added third tab "Sermon Workspace" with full sermon building capabilities
  * Implemented main editor with sermon title, scripture, theme, and body text areas
  * Created three writing modes: Outline, Full Manuscript, and Bullets with mode-specific guidance
  * Added AI enhancement buttons: Expand Point, Rewrite Clearly, Add Supporting Verse, Add Illustration
  * Built Preaching Outline Builder with structured format (Title, Text, Theme, 3 Points, Call to Action, Closing)
  * Integrated Voice & Style Selector with 5 preaching styles: Prophetic, Teaching, Evangelistic, Youth/Modern, Devotional
  * Added "Convert my notes to outline format" and "Rewrite in selected style" AI functionality
  * Designed responsive layout with main editor and sidebar for AI tools and outline builder
  * Added comprehensive copy and download functionality for sermon content including individual section copying
  * Integrated detailed style guide for complete sermon rewriting with authentic voice characteristics
  * Created backend API endpoint `/api/chat/enhance` with detailed prompts for each preaching style
- June 16, 2025: Enhanced sermon AI functionality with text selection and undo features
  * Fixed API parameter order bugs causing "Method is not a valid HTTP token" errors
  * Implemented text selection requirement for AI enhancement buttons
  * Added clear Scholar attribution formatting for all AI enhancements
  * Built undo/revert functionality to restore previous content before enhancement
  * Enhanced error handling and user feedback for better workflow experience
  * Buttons now require highlighted text and provide specific responses per action type
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```