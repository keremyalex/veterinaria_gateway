# Microservicio Gateway - Veterinaria

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Microservicio Gateway construido con NestJS y Apollo GraphQL para el sistema de veterinaria. Este servicio actúa como punto de entrada único para la comunicación entre los diferentes microservicios.

## 📋 Descripción

Este gateway utiliza Apollo Federation para combinar múltiples esquemas GraphQL de diferentes microservicios en un solo endpoint unificado.

## 📁 Archivos Docker

- `Dockerfile` - Configuración para construir la imagen Docker
- `.dockerignore` - Archivos a excluir del contexto Docker
- `docker-compose.yml` - Configuración para orquestación
- `.env.example` - Variables de entorno de ejemplo

## 🚀 Despliegue Local (Desarrollo)

### 1. Preparar variables de entorno
```bash
# Crear archivo .env basado en el ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001/graphql
```

### 2. Opción A: Docker Compose (Recomendado)
```bash
# Construir y ejecutar todos los servicios
docker compose up --build

# O ejecutar en segundo plano
docker compose up -d --build

# Ver logs en tiempo real
docker compose logs -f gateway

# Detener servicios
docker compose down
```

### 3. Opción B: Docker directo
```bash
# Construir la imagen
docker build -t microservicio-gateway:latest .

# Ejecutar el contenedor
docker run -p 3000:3000 --env-file .env microservicio-gateway:latest

# O con variables de entorno inline
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  -e AUTH_SERVICE_URL=http://localhost:3001/graphql \
  microservicio-gateway:latest
```

## 🌐 Despliegue en Producción

### 1. Configurar variables de entorno de producción
```bash
# Crear archivo .env
cp .env.example .env
nano .env
```

Configurar variables para producción:
```env
NODE_ENV=production
PORT=3000
AUTH_SERVICE_URL=http://auth-service:3001/graphql
```

### 2. Desplegar en producción
```bash
# Construir y ejecutar en segundo plano
docker compose up -d --build

# Verificar que los contenedores estén corriendo
docker compose ps

# Ver logs
docker compose logs -f gateway
```

## 📊 Monitoreo y Mantenimiento

### Ver logs
```bash
# Logs del gateway
docker compose logs -f gateway

# Logs de todos los servicios
docker compose logs -f

# Últimas 100 líneas
docker compose logs --tail 100 gateway
```

### Estado de contenedores
```bash
# Ver contenedores corriendo
docker compose ps

# Ver uso de recursos
docker stats

# Ver información del sistema
docker system df
```

### Comandos útiles
```bash
# Reiniciar solo el gateway
docker compose restart gateway

# Reconstruir y actualizar
docker compose up -d --build

# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune
```

## 🔒 Seguridad

### Buenas prácticas implementadas:
- ✅ Usuario no-root en el contenedor
- ✅ Variables de entorno para configuración sensible
- ✅ Red Docker personalizada
- ✅ Imagen Alpine para menor superficie de ataque

### Recomendaciones adicionales:
- 🔐 Usar un firewall (ufw, iptables)
- 🔐 Configurar fail2ban
- 🔐 Mantener Docker actualizado
- 🔐 Usar secrets de Docker para datos sensibles en producción

## 🚦 Health Check

El Dockerfile incluye un health check básico. Para verificar manualmente:

```bash
# Verificar estado del contenedor
docker compose exec gateway curl -f http://localhost:3000/graphql || echo "Servicio no disponible"

# Ver estado de health check
docker inspect microservicio_gateway_gateway_1 | grep -A 10 Health
```

## 🔄 Actualización del Servicio

### Para actualizaciones sin downtime:
```bash
# 1. Construir nueva imagen
docker compose build gateway

# 2. Recrear solo el servicio gateway
docker compose up -d --no-deps gateway

# 3. Verificar que funciona
docker compose ps
docker compose logs gateway
```

## ⚠️ Notas Importantes

- 📌 Asegúrate de que el servicio de autenticación esté corriendo antes del gateway
- 📌 El puerto 3000 debe estar disponible en tu VPS
- 📌 Configura las variables de entorno correctamente según tu arquitectura
- 📌 Para producción, considera usar un registro de contenedores (Docker Hub, AWS ECR, etc.)
- 📌 Realiza backups regulares de tus configuraciones

## 🆘 Troubleshooting

### Problemas comunes:

**1. Puerto ya en uso:**
```bash
# Ver qué proceso usa el puerto 3000
sudo lsof -i :3000
# o
sudo netstat -tulpn | grep 3000
```

**2. Contenedor no se conecta al servicio de auth:**
```bash
# Verificar conectividad de red
docker compose exec gateway ping auth-service
```

**3. Variables de entorno no cargadas:**
```bash
# Verificar variables dentro del contenedor
docker compose exec gateway env | grep AUTH_SERVICE_URL
```

## 📞 Soporte

Si encuentras problemas, revisa:
1. Los logs del contenedor
2. La configuración de red
3. Las variables de entorno
4. La conectividad con otros servicios