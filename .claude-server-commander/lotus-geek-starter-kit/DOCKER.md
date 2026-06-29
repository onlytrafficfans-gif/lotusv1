# Lotus App Builder UI — Docker Setup

## Quick Start

### Build & Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will:
1. Build the production image
2. Start the container on `http://localhost:3000`
3. Enable auto-restart on failure
4. Run health checks every 30 seconds

### Manual Docker Build & Run

```bash
# Build the image
docker build -t lotus-app-builder-ui .

# Run the container
docker run -p 3000:3000 --name lotus-ui lotus-app-builder-ui
```

### Stop & Clean Up

```bash
# Stop container
docker-compose down

# Remove image
docker rmi lotus-geek-starter-kit-lotus-ui
```

## What's Included

- **Multi-stage build** — optimized for production
- **Health checks** — automatic restart on failure
- **Alpine Linux base** — minimal footprint (~200MB total)
- **Serve** — lightweight production HTTP server
- **.dockerignore** — excludes unnecessary files from context

## Environment

- **Port:** 3000
- **Container name:** lotus-app-builder-ui
- **Restart policy:** unless-stopped
- **Image base:** node:20-alpine
- **Build time:** ~2 minutes on first run

## Debugging

```bash
# View logs
docker logs lotus-ui

# Shell into running container
docker exec -it lotus-ui sh

# Inspect image
docker image inspect lotus-geek-starter-kit-lotus-ui
```

## Docker Desktop Issues

If Docker Desktop is unresponsive:

```powershell
# Restart Docker service (Windows)
Stop-Service docker
Start-Service docker

# Or restart Docker Desktop from System Tray
```

If the above doesn't work, restart Docker Desktop completely from the application menu.

## Production Deployment

For production deployments:

1. Add `.env.production` with environment variables
2. Configure reverse proxy (Nginx, HAProxy, Cloudflare)
3. Enable HTTPS/TLS
4. Set up monitoring and log aggregation
5. Use container orchestration (Docker Swarm, Kubernetes)

## Image Size

- **Builder stage:** ~500MB
- **Final image:** ~200MB (dependencies + dist)
- **Running container:** ~150-200MB memory

## See Also

- [Dockerfile](./Dockerfile) — Production container definition
- [docker-compose.yml](./docker-compose.yml) — Container orchestration
- [package.json](./package.json) — Build and runtime dependencies
