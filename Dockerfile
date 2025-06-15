# Multi-stage build for full-stack app
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY futbol-app-frontend/package*.json ./
RUN npm install
COPY futbol-app-frontend/ ./
RUN npm run build

FROM eclipse-temurin:17-jdk as backend-build
WORKDIR /app/backend
COPY futbol-app-backend/ ./
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM nginx:alpine
# Copy frontend build
COPY --from=frontend-build /app/frontend/dist/futbol-app/browser /usr/share/nginx/html/
COPY --from=backend-build /app/backend/target/*.jar /app/backend.jar

# Install Java in nginx container
RUN apk add --no-cache openjdk17-jre

# Copy nginx config
COPY futbol-app-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'java -jar /app/backend.jar &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 8080
CMD ["/start.sh"]
