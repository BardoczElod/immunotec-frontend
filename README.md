# Immunotec Frontend

This is the frontend (React) service for Immunotec.

## Development with Docker Compose (Hot Reload)

To run the project in development mode with Docker and hot reload:

1. Make sure Docker is installed and running.
2. Use the provided docker-compose file:

```
docker-compose up
```

- Edit files in `src/` or `public/` and changes will be reflected automatically.
- The development server will be available at http://localhost:3000.
- Environment variables can be set in your shell or in a `.env` file.

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
