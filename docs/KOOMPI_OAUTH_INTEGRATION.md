# Koompi OAuth SSO Integration Guide

Welcome to the Bitriel OAuth SSO integration guide! This document explains how our Single Sign-On (SSO) system works using Koompi OAuth, how it's structured across our monorepo, and how you can work with it.

## 🌟 Overview

We use the **OAuth 2.0 Authorization Code Flow** to securely authenticate users. This ensures that:
1.  **Security**: Client secrets are never exposed to the frontend (mobile/web).
2.  **Consistency**: Both mobile and web apps use the same backend logic.
3.  **Centralized Control**: Configuration is managed in one place (the backend).

### The Flow

1.  **Initiate**: The client (Mobile/Web) asks the Backend for the OAuth configuration (`/api/oauth/login`).
2.  **Authorize**: The client redirects the user to the Koompi OAuth page.
3.  **Callback (Ingress)**: Koompi redirects the user back to our Backend (`/api/oauth/callback`) with a temporary code.
4.  **Exchange**: The Backend exchanges this code for a secure Access Token and User Profile.
5.  **Session**: The Backend creates a JWT for our app.
6.  **Redirect (Egress)**: The Backend redirects the user back to the Client (Deep Link for Mobile, URL for Web) with the JWT.

---

## 🏗️ Project Structure

The integration is distributed across our monorepo:

### 1. Backend (`apps/backend`)
*   **`src/routes/oauthRoutes.ts`**: Defines the endpoints (`/login`, `/callback`).
*   **`src/controllers/oauthController.ts`**: Handles the logic. It distinguishes between Mobile and Web using the `?platform=` query parameter.
*   **`src/services/oauthService.ts`**: The heavy lifter. Handles the token exchange with Koompi and user creation/lookup in our DB.
*   **`src/config.ts`**: Central configuration file.

### 2. Mobile (`apps/mobile`)
*   **`hooks/useAuth.ts`**: The brain of mobile auth. It fetches config from the backend and handles the deep link callback (`bitriel://oauth/callback`).

### 3. Web (`apps/web`)
*   **`src/lib/api.ts`**: Helper to fetch the OAuth config.
*   **`src/context/AuthContext.tsx`**: Manages the login flow and stores the token.

---

## 🚀 Setup & Configuration

To get this running locally, you need to configure your environment variables.

### Backend (`apps/backend/.env`)

This is the **Single Source of Truth**.

```bash
# Koompi Client Credentials (Get these from the Koompi Dashboard)
KOOMPI_CLIENT_ID=pk_live_...
KOOMPI_CLIENT_SECRET=sk_live_...

# Redirect URI for WEB (Where Koompi sends web users)
KOOMPI_REDIRECT_URI=http://localhost:4000/api/oauth/callback

# Redirect URI for MOBILE (Where Koompi sends mobile users)
# IMPORTANT: For local mobile dev, use your NGROK URL!
KOOMPI_MOBILE_REDIRECT_URI=https://YOUR-NGROK-ID.ngrok-free.app/api/oauth/callback?platform=mobile
```

### Mobile & Web
*   **Mobile**: No config needed! It fetches everything from the backend.
*   **Web**: Just needs to know where the backend is (`VITE_API_BASE_URL`).

---

## 💻 Implementation Details

### The "Platform" Parameter
We use a single callback endpoint on the backend, but we need to know where to send the user *after* login. We solve this with a query parameter:

*   **Web**: `/api/oauth/callback` (Defaults to web flow) -> Redirects to `http://localhost:5173/oauth/callback`
*   **Mobile**: `/api/oauth/callback?platform=mobile` -> Redirects to `bitriel://oauth/callback`

### Mobile Deep Linking
On mobile, we use **Deep Linking** to get the user back into the app.
1.  Backend redirects to `bitriel://oauth/callback?token=JWT_TOKEN`.
2.  Mobile app listens for `bitriel://` links.
3.  `useAuth.ts` parses the URL, extracts the `token`, and logs the user in.

---

## 🛠️ Developer Experience Tips

### 1. Using Ngrok for Mobile Dev
Since the OAuth provider (Koompi) cannot redirect to `localhost` on your phone, you **must** use a tunnel like Ngrok.
1.  Start backend: `pnpm dev`
2.  Start ngrok: `ngrok http 4000`
3.  Update `KOOMPI_MOBILE_REDIRECT_URI` in `apps/backend/.env` with your ngrok URL.
4.  Restart backend.

### 2. Debugging
*   **Backend Logs**: We log key steps in the OAuth flow. Look for `[OAuth]` tags in your terminal.
*   **Mobile Logs**: Use `console.log` in `useAuth.ts` to see the exact URL the app receives.

### 3. Adding a New Platform
Want to add a Desktop app?
1.  Update `oauthController.ts` to handle `?platform=desktop`.
2.  Add a `desktopRedirectUri` to `config.ts`.
3.  Update `OAuthService.ts` to return the correct custom protocol (e.g., `bitriel-desktop://...`).

---

## ❓ Troubleshooting

**"Redirect URI not authorized"**
*   **Cause**: The URI sent by the backend doesn't match what's whitelisted in Koompi.
*   **Fix**: Check `apps/backend/.env`. Ensure `KOOMPI_MOBILE_REDIRECT_URI` exactly matches what you added to the Koompi dashboard.

**"Invalid Client"**
*   **Cause**: Wrong Client ID or Secret.
*   **Fix**: Double-check your `.env` variables.

**App doesn't open after login**
*   **Cause**: Deep link scheme mismatch.
*   **Fix**: Ensure `app.json` in `apps/mobile` has the `scheme: "bitriel"` property set.
