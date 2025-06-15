# Deploy en Railway

## Pasos para hacer deploy:

### 1. Preparar el repositorio
1. Sube tu código a GitHub
2. Asegúrate de que todos los archivos estén incluidos

### 2. Crear proyecto en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio

### 3. Configurar variables de entorno
En Railway dashboard:
1. Ve a Variables tab
2. Añade estas variables:

```
POSTGRES_DB=futbol_app_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=tu_password_segura
FRONTEND_PORT=80
BACKEND_PORT=8080
```

### 4. Configurar servicios
Railway detectará automáticamente tu docker-compose.yml y creará:
- Servicio de base de datos PostgreSQL
- Servicio backend (Spring Boot)
- Servicio frontend (Angular/Nginx)

### 5. Configurar dominios
1. Ve a Settings > Domains
2. Railway te dará URLs como:
   - Frontend: `https://tu-app-frontend.railway.app`
   - Backend: `https://tu-app-backend.railway.app`

### 6. Deploy automático
- Cada push a main branch hará deploy automático
- Railway construirá y desplegará tus contenedores

## Alternativa: Deploy manual
Si prefieres deploy manual:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar proyecto
railway link

# Deploy
railway up
```

## Monitoreo
- Ve a Railway dashboard para logs
- Monitoring de recursos
- Métricas de performance
