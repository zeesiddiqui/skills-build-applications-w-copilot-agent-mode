# OctoFit Tracker Frontend

This React app uses the OctoFit backend API and supports both local development and GitHub Codespaces.

## Required environment variable

Define `VITE_CODESPACE_NAME` in `.env.local` before running the app in a Codespace.

Example:

```bash
VITE_CODESPACE_NAME=my-codespace-name
```

When the variable is set, requests are sent to:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If the variable is not set, the frontend safely falls back to `http://localhost:8000` instead of generating `https://undefined-8000...` URLs.

## Component routes

The app uses React Router and fetches data for the following pages:

- `/`
- `/teams`
- `/activities`
- `/leaderboard`
- `/workouts`
- `/users`

The frontend accepts array responses and common paginated payloads such as `data`, `items`, `results`, and `records`.
