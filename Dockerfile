# syntax=docker/dockerfile:1

# ---- Build stage: compile the Vite app to static files ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# The app calls a same-origin relative /api/v1.0 path, so no API URL is baked
# in at build time — the nginx layer proxies /api to the backend at runtime.
COPY . .
RUN npm run build

# ---- Runtime stage: serve the static build with nginx ----
FROM nginx:1.27-alpine AS runtime

# The official nginx entrypoint runs envsubst over /etc/nginx/templates/*.template
# at startup, so BACKEND_URL is injected into the config without rebuilding.
# Default targets the docker-compose backend service; k8s overrides it.
ENV BACKEND_URL=http://backend:8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost/healthz >/dev/null 2>&1 || exit 1

# Keep the default nginx entrypoint (it runs the template substitution),
# only override the command for clarity.
CMD ["nginx", "-g", "daemon off;"]
