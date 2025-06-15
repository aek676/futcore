# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Add debug to see the output directory structure
RUN ls -la /app/dist

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/futbol-app/browser /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80