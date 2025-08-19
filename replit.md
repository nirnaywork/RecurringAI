# Recurring Payments AI Tracker

## Overview

This is a full-stack web application built to help users identify and manage forgotten recurring payments and subscriptions. The system uses AI-powered analysis of bank statements to detect recurring charges and provides automated email reminders to help users stay on top of their financial commitments. The application features a clean, Claude AI-inspired design with a muted grey color scheme and provides comprehensive subscription management tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom Claude-inspired color palette (muted greys)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage
- **File Upload**: Multer middleware for handling bank statement uploads
- **AI Processing**: Simulated AI analysis for recurring payment detection (placeholder for actual ML implementation)

### Authentication System

- **Provider**: Replit Auth integration using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Security**: HTTP-only cookies with secure session management

### Database Design

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema Structure**:
  - Users table for authentication (required by Replit Auth)
  - Sessions table for session storage (required by Replit Auth) 
  - Uploads table for bank statement file tracking
  - Recurring payments table for detected subscriptions
  - Reminders table for user notification preferences
  - Reminder history table for tracking sent notifications

### File Storage & Processing

- **Upload Handling**: Local disk storage with organized directory structure
- **Supported Formats**: PDF, JPG, PNG bank statements
- **File Validation**: Size limits (10MB) and type restrictions
- **Processing Pipeline**: Upload → AI Analysis → Payment Detection → Database Storage

### UI/UX Design System

- **Design Theme**: Claude AI-inspired with muted grey color palette
- **Layout**: Split-screen landing page, sidebar navigation for authenticated users
- **Responsive Design**: Mobile and desktop optimized layouts
- **Components**: Consistent shadcn/ui component library with custom theming

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth (OpenID Connect)
- **WebSocket**: ws library for Neon connection handling

### Frontend Libraries
- **UI Components**: Extensive Radix UI component suite (@radix-ui/react-*)
- **Data Fetching**: TanStack React Query for server state
- **Form Management**: React Hook Form with Hookform resolvers
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation

### Backend Libraries
- **File Upload**: Multer for multipart form data handling
- **Database**: Drizzle ORM with Neon serverless adapter
- **Validation**: Drizzle-zod for schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Security**: Memoizee for caching authentication configs

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Full TypeScript support across frontend and backend
- **Code Quality**: ESLint and TypeScript compiler checks
- **Development**: Replit-specific plugins for development environment integration

### Planned Integrations
- **Email Service**: For OTP verification and monthly reminder notifications (not yet implemented)
- **AI/ML Service**: For actual bank statement analysis and recurring payment detection (currently simulated)
- **External Bank APIs**: Potential integration with banking APIs for automated statement retrieval