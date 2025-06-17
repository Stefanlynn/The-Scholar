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

### Netlify Deployment
- **Serverless Functions**: Backend API converted to Netlify serverless functions
- **Build Process**: Custom build script handles frontend (Vite) and backend (esbuild) compilation
- **Static Assets**: Frontend assets served from `dist/public` directory
- **API Routes**: All `/api/*` requests redirect to `/.netlify/functions/api`
- **Environment**: Node.js 18 runtime with PostgreSQL database support

### Replit Development
- **Port Configuration**: Server runs on port 5000 for local development
- **Hot Reloading**: Both frontend and backend reload automatically during development

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
  * Added loading indicators with dynamic text for all AI enhancement buttons
  * Fixed mobile layout for header buttons to prevent overflow and improve usability
  * Updated "Add Verse" to return only scripture references and text without commentary
- June 16, 2025: Integrated custom Scholar graduation cap logo throughout the application
  * Replaced text-based graduation cap icons with actual Scholar logo image
  * Updated sidebar header, mobile navigation, and chat interface to use new logo
  * Maintained consistent Scholar branding across all user touchpoints
  * Logo displays properly in both desktop sidebar and mobile tab bar with appropriate sizing
- June 16, 2025: Configured comprehensive Netlify deployment infrastructure
  * Created serverless function wrapper for Express.js backend API using @netlify/functions
  * Built custom build script with optimized frontend (Vite) and backend (esbuild) compilation
  * Configured netlify.toml with proper redirects, caching headers, and Node.js 18 runtime
  * Set up asset handling with logo files properly placed in public directory
  * Added environment variable support for DATABASE_URL and API keys in serverless context
  * Implemented API route redirects from /api/* to /.netlify/functions/api for seamless deployment
- June 16, 2025: Fixed chat authentication system for seamless user conversations
  * Resolved "failed to send message" errors by implementing authentication fallback logic
  * Updated chat endpoint to work with both authenticated users and demo user fallback
  * Removed suggested questions panel to provide full space for conversation history
  * Fixed TypeScript errors in query client authentication header handling
  * Verified complete chat functionality with proper message sending and AI responses
  * Chat now properly saves messages to user's personal conversation history
- June 16, 2025: Rebuilt chat interface with ChatGPT-style conversation flow
  * Completely redesigned chat to work like ChatGPT/Messenger with persistent conversations
  * Messages appear immediately when sent and remain visible throughout the conversation
  * Added real-time thinking indicator with animated dots when The Scholar is responding
  * Implemented proper conversation state management to prevent message disappearing
  * Added The Scholar's welcome message with capabilities overview for new conversations
  * Chat now provides seamless back-and-forth conversation experience with full message history
- June 16, 2025: Added Study Mode and Devotional Mode with persistent welcome message
  * Created toggle buttons for Study Mode (academic analysis) and Devotional Mode (heart-level encouragement)
  * Study Mode provides Greek/Hebrew analysis, cross-references, theological depth, and sermon tools
  * Devotional Mode offers warm encouragement, personal application, and spiritual reflection
  * The Scholar adapts response style completely based on selected mode
  * Welcome message now appears whenever conversation is empty and returns after clearing chat
  * Added "New Conversation" button to clear current chat and restore welcome message
  * Mode selection persists throughout the conversation for consistent Scholar personality
- June 16, 2025: Integrated expert voice adaptation system for topic-specific responses
  * Added automatic voice adaptation based on question topics using expert biblical teachers
  * Study Mode uses voices like Dr. Frank Turek, John Maxwell, John Piper, and Tim Mackie based on topic
  * Devotional Mode channels Bob Hamp and Kris Vallotton's approaches for heart-level ministry
  * The Scholar automatically selects appropriate expert voice: apologetics, leadership, exposition, prophetic insight, or pastoral care
  * Maintains all existing biblical API integrations while delivering insights through expert personality lenses
  * Removed "Add to Sermon" button and ensured "Save to Notes" properly integrates with Notes section
- June 16, 2025: Implemented premium formatting system for Bible page Scholar tools
  * Bible Scholar tools now use structured, professional format like premium Bible software
  * Responses include bold section titles, italicized Greek/Hebrew words, bullet points, and short scannable paragraphs
  * Each tool (Greek/Hebrew, Cross-References, Commentary, etc.) follows consistent 8-section layout structure
  * Added verse reference header, topical tags, sermon tools, and devotional builders where appropriate
  * Formatting ensures excellent on-screen reading for pastors and Bible students
  * Maintains expert voice adaptation while delivering content in premium visual structure
- June 16, 2025: Enhanced Bible study tools with inline Scholar conversation feature
  * "Ask The Scholar" section now responds directly within the study tools dialog
  * No separate popup - Scholar responses appear immediately below the question textarea
  * Added "New Question" button to clear responses and ask follow-up questions
  * Maintains conversation flow while studying specific verses
  * Responses can be saved to Notes with question context included
  * Loading states and error handling integrated for seamless user experience
- June 17, 2025: Fixed chat AI response system and enhanced Bible study tools navigation
  * Restored proper Study Mode and Devotional Mode conversation format instead of structured Bible tools format
  * Added "Back to Tools" button in Scholar Response Dialog to return to main study tools grid
  * Removed "Add to Sermon" button from Bible study tools quick actions for cleaner interface
  * Chat now responds conversationally with expert voice adaptation based on selected mode
  * Bible study tools maintain verse context when navigating between different analysis options
- June 17, 2025: Completely redesigned onboarding and created interactive app tutorial system
  * Rebuilt three welcome pages with modern, engaging introduction to The Scholar's features and benefits
  * Page 1: Welcome with AI-powered study companion overview and key feature highlights
  * Page 2: Comprehensive feature showcase with six major sections (Chat, Bible Study, Notes, Sermon Prep, Library, Profile)
  * Page 3: User choice between guided tour or jumping directly into the app
  * Created interactive AppTutorial component with step-by-step walkthrough of every major feature
  * Tutorial includes progress tracking, feature explanations, and direct navigation to each section
  * Added help button (?) to Notes page with comprehensive usage guides for all three tabs
  * Integrated tutorial system with localStorage preferences for seamless user experience
  * Users can skip tour or take guided walkthrough covering Chat modes, Bible tools, Notes workspace, Library resources, and Profile settings
- June 17, 2025: Enhanced mobile responsiveness and added help button to Bible page mobile view
  * Mobile-optimized Library page header with responsive text sizes and search bar
  * Mobile-optimized Profile page header with responsive buttons and layout
  * Enhanced content spacing and grid layouts for better mobile viewing
  * Added help button (question mark) to mobile Bible page header for accessing study instructions
  * Comprehensive mobile optimization across all major pages with proper spacing and touch-friendly elements
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```