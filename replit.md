# Overview

GISABO is a cross-border financial platform designed for the African diaspora to access digital financial services globally. The platform combines money transfer services with a marketplace for African products, supporting both web and mobile applications. It serves as a bridge connecting diaspora communities with their home countries, offering secure international transfers and authentic African product purchases.

**New Feature: Assistant Gisabo** - An AI-powered chatbot integrated across the platform to provide instant customer support and answer questions about transfers, marketplace, and platform features using OpenAI's GPT-4o model.

**Deployment Ready: Digital Ocean App Platform** - All configuration files prepared for production deployment including database setup, environment variables, health checks, and automated deployment scripts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Web Application**: React.js with TypeScript for the main web interface
- **Mobile Application**: React Native with Expo for cross-platform mobile support
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and local state management
- **Animations**: Framer Motion for enhanced user experience
- **Internationalization**: Custom i18n system supporting French and English

## Backend Architecture
- **API Server**: Express.js with TypeScript providing RESTful endpoints
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Upload**: Multer middleware for handling image uploads (services and products)
- **Email Service**: SendGrid integration for transactional emails (transfer confirmations, order notifications)
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations

## Data Storage Solutions
- **Primary Database**: PostgreSQL with the following core entities:
  - Users (authentication and profile data)
  - Products and Categories (marketplace items)
  - Transfers (money transfer transactions)
  - Orders and OrderItems (e-commerce transactions)
  - ExchangeRates (currency conversion data)
  - Services (business service offerings)
  - Admins (administrative users)

## Authentication and Authorization
- **User Authentication**: JWT tokens with localStorage persistence for web clients
- **Admin Authentication**: Separate JWT system for administrative access
- **Role-based Access**: User and admin roles with different permission levels
- **Password Security**: Bcrypt hashing with proper salt rounds

## Payment Processing
- **Primary Payment Processor**: Square integration for card payments and Afterpay
- **Multi-environment Support**: Sandbox and production environments
- **Payment Methods**: Credit/debit cards, Afterpay buy-now-pay-later option
- **Security**: PCI DSS compliant payment handling through Square SDK

## Mobile Architecture
- **Cross-platform Development**: React Native with Expo for iOS and Android
- **API Integration**: Shared API endpoints with web application
- **Offline Capability**: Local storage for cart and user preferences
- **Native Features**: Camera integration, secure storage, and push notifications

# External Dependencies

## Payment Services
- **Square API**: Primary payment processor with sandbox/production environments
- **Square Web SDK**: Client-side payment form handling
- **Afterpay Integration**: Buy-now-pay-later payment option

## Database and Hosting
- **PostgreSQL**: Primary database (configurable via DATABASE_URL)
- **Neon Database**: Serverless PostgreSQL provider integration

## Communication Services
- **SendGrid**: Email delivery service for transactional emails
- **SMTP Configuration**: PlanetHoster email service integration
- **OpenAI API**: GPT-4o integration for Assistant Gisabo chatbot functionality

## Development and Deployment
- **Vite**: Build tool and development server for web application
- **Expo**: Development and deployment platform for mobile applications
- **Drizzle Kit**: Database migration and schema management

## Third-party Libraries
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Image Processing**: Multer for file uploads with type validation
- **Security**: bcrypt for password hashing, jsonwebtoken for authentication

## API Integrations
- **Exchange Rate Service**: Real-time currency conversion for international transfers
- **Country/Currency Data**: Support for multiple African countries and currencies
- **Geographic Services**: Country and location data for transfer destinations
- **OpenAI GPT-4o**: AI assistant providing contextual support and answering user questions about platform features