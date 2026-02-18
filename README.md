# Immunotec Frontend

This is the frontend (React) service for Immunotec.

## Local Development

1. Install dependencies:
   npm install
2. Start the dev server:
   npm start

## Docker

Build and run:
```
docker build -t immunotec-frontend .
docker run -p 3000:3000 immunotec-frontend
```

## Deployment (Render)
- Use the Dockerfile in this directory.
- Expose port 3000.
- Set the environment variable `REACT_APP_API_URL` to your backend's public URL.

## Notes
- The frontend expects the backend API URL in `REACT_APP_API_URL` at build time.
- For production, the React app is served as static files.
