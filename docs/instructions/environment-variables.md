# Environment Variables

This document describes the environment variables required for the application.

## Authentication

### Google OAuth 2.0

- **GOOGLE_CLIENT_ID**  
  The OAuth 2.0 client ID for server-side use. Obtained from Google Cloud Console.

- **VITE_GOOGLE_CLIENT_ID**  
  The same OAuth 2.0 client ID for client-side use in Vue.js/Vite. This is the same value as GOOGLE_CLIENT_ID but with the VITE_ prefix to expose it to the frontend build.  
  Note: Client IDs are safe to expose in frontend code.

- **GOOGLE_CLIENT_SECRET**  
  The OAuth 2.0 client secret obtained from Google Cloud Console. This is a confidential key used for server-side authentication flow. Keep this value secure and never expose it in client-side code.

- **GOOGLE_REDIRECT_URI**  
  The authorized redirect URI registered in Google Cloud Console. This is where users will be redirected after authentication. Must match exactly with the URI configured in Google Cloud Console.  
  Example: `http://localhost:3000/auth/google/callback` (development) or `https://yourdomain.com/auth/google/callback` (production)

## Application Configuration

### Server Configuration

- **PORT**  
  The port number on which the application server will listen. Defaults to 3000 if not specified.  
  Example: `3000`

- **NODE_ENV**  
  Specifies the environment in which the application is running. Controls various behaviors like error handling, logging, and optimizations.  
  Values: `development`, `production`, `test`

### Security

- **JWT_SECRET**  
  Secret key for signing JSON Web Tokens used for API authentication. Should be a strong, random string.  
  Example: Generate using `openssl rand -base64 32`

## Setup Instructions

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all required values in the `.env` file

3. For production deployments, ensure all sensitive values are stored securely using your platform's secret management system (e.g., environment variables in Vercel, Render, or Fly.io)

## Security Best Practices

1. Never commit `.env` files to version control
2. Use different values for development and production environments
3. Rotate secrets regularly, especially if they may have been exposed
4. Use strong, randomly generated values for all secrets
5. Limit access to production environment variables to authorized personnel only
