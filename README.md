# 🚀 Cómo Arrancar el Proyecto Backend

## 📋 PREREQUISITOS
1. **Node.js** v18 o superior
2. **npm** o **yarn**
3. **MongoDB** ejecutándose localmente

## 🛠️ PASOS DE INSTALACIÓN

### 1. INSTALAR DEPENDENCIAS
```bash
npm install
```

### 2. CONFIGURAR VARIABLES DE ENTORNO
Crear archivo `.env` en la raíz con:
```env
DATABASE_URL="mongodb://localhost:27017/kanban"
```

### 3. INICIAR MONGODB
```bash
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod

# O ejecutar manualmente:
mongod --dbpath "C:\data\db"
```

### 4. EJECUTAR EL PROYECTO

**Opción A: Modo Desarrollo** (con recarga automática)
```bash
npm run start:dev
```

**Opción B: Modo Producción**
```bash
npm run build
npm run start:prod
```

**Opción C: Modo Normal**
```bash
npm run start
```

## ✅ VERIFICAR QUE FUNCIONA
- **API REST**: http://localhost:3001
- **WebSocket**: ws://localhost:3001
- **MongoDB**: mongodb://localhost:27017

## 📡 ENDPOINTS PRINCIPALES
```
GET    /columns          # Obtener todas las columnas
POST   /columns          # Crear columna
PATCH  /columns/:id      # Actualizar columna
DELETE /columns/:id      # Eliminar columna

GET    /cards/:columnId  # Obtener tarjetas
POST   /cards            # Crear tarjeta
PATCH  /cards/move/:id   # Mover tarjeta
DELETE /cards/:id        # Eliminar tarjeta
```

## 🔧 SOLUCIÓN DE PROBLEMAS

**Error: MongoDB no conecta**
```bash
# Verificar que MongoDB está corriendo
mongo --eval "db.adminCommand('ping')"
```

**Error: Puerto 3001 ocupado**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <NUMERO_PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

**Error: Dependencias**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

¡Listo! El backend estará corriendo en http://localhost:3001