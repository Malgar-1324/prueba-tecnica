# Sistema de Gestión de Tareas

Sistema completo de gestión de tareas con Backend en FastAPI (Python), Frontend en React con Redux-Saga, App Móvil en React Native, y Base de Datos SQL Server.

## 📋 Índice

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Pruebas](#pruebas)

## 📝 Descripción

Sistema de gestión de tareas que permite:
- ✅ Crear nuevas tareas
- 📋 Listar todas las tareas
- ✏️ Editar tareas existentes
- ✓ Marcar tareas como completadas
- 🗑️ Eliminar tareas
- 🔍 Filtrar tareas por estado (Pendiente, En Progreso, Completada)

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno y rápido para Python
- **Python 3.11** - Lenguaje de programación
- **pyodbc** - Conector para SQL Server
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18** - Biblioteca de JavaScript para UI
- **Redux Toolkit** - Gestión de estado
- **Redux-Saga** - Middleware para efectos secundarios
- **Axios** - Cliente HTTP
- **CSS3** - Estilos

### Mobile
- **React Native** - Framework para aplicaciones móviles
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Axios** - Cliente HTTP

### Base de Datos
- **SQL Server 2022** - Sistema de gestión de base de datos
- **Procedimientos Almacenados** - Lógica de negocio en BD

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de contenedores

## 📁 Estructura del Proyecto

```
prueba-tecnica/
│
├── backend/                    # Backend FastAPI
│   ├── main.py                # Aplicación principal
│   ├── requirements.txt       # Dependencias Python
│   ├── Dockerfile            # Configuración Docker
│   └── .env.example          # Variables de entorno de ejemplo
│
├── frontend/                  # Frontend React
│   ├── public/               # Archivos públicos
│   ├── src/
│   │   ├── api/             # Configuración de API
│   │   ├── components/      # Componentes React
│   │   ├── store/           # Redux store y slices
│   │   ├── sagas/           # Redux-Saga
│   │   ├── App.js           # Componente principal
│   │   └── index.js         # Punto de entrada
│   ├── package.json         # Dependencias Node
│   ├── Dockerfile           # Configuración Docker
│   └── .env.example         # Variables de entorno de ejemplo
│
├── mobile/                    # App móvil React Native
│   ├── src/
│   │   ├── api/             # Configuración de API
│   │   └── screens/         # Pantallas de la app
│   ├── App.js               # Componente principal
│   ├── package.json         # Dependencias
│   └── app.json             # Configuración Expo
│
├── database/                  # Scripts SQL
│   └── init.sql             # Script de inicialización
│
├── docker-compose.yml        # Orquestación de servicios
└── README.md                 # Este archivo
```

## 📦 Requisitos Previos

- **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop)
- **Node.js 18+** - [Descargar](https://nodejs.org/) (para desarrollo local)
- **Python 3.11+** - [Descargar](https://www.python.org/) (para desarrollo local)
- **Git** - [Descargar](https://git-scm.com/)

### Para desarrollo móvil:
- **Expo CLI** - `npm install -g expo-cli`
- **Expo Go App** en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd prueba-tecnica
```

### 2. Configurar variables de entorno

#### Backend
```bash
cp backend/.env.example backend/.env
```

#### Frontend
```bash
cp frontend/.env.example frontend/.env
```

### 3. Levantar servicios con Docker Compose

```bash
docker-compose up -d
```

Este comando levantará:
- ✅ SQL Server en `localhost:1433`
- ✅ Backend API en `http://localhost:8000`
- ✅ Frontend en `http://localhost:3000`

### 4. Inicializar la base de datos

Espera unos segundos a que SQL Server esté listo, luego ejecuta:

```bash
docker exec -it sqlserver-tareas /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -i /docker-entrypoint-initdb.d/init.sql
```

### 5. Configurar la aplicación móvil

```bash
cd mobile
npm install
```

**IMPORTANTE**: Antes de ejecutar la app móvil, edita el archivo `mobile/src/api/tareasApi.js` y cambia la URL de la API:

```javascript
// Reemplaza localhost con la IP de tu computadora
const API_URL = 'http://TU_IP_LOCAL:8000';
// Ejemplo: const API_URL = 'http://192.168.1.100:8000';
```

Para encontrar tu IP:
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` o `ip addr`

Luego ejecuta:

```bash
npm start
```

Escanea el código QR con Expo Go en tu dispositivo móvil.

## 💻 Uso

### Acceder a las aplicaciones

- **Frontend Web**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **App Móvil**: Escanear QR con Expo Go

### Desarrollo local (sin Docker)

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Mobile
```bash
cd mobile
npm install
npm start
```

## 📡 API Endpoints

### Base URL: `http://localhost:8000`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tareas` | Obtener todas las tareas |
| GET | `/api/tareas?estado=Pendiente` | Filtrar tareas por estado |
| GET | `/api/tareas/{id}` | Obtener una tarea específica |
| POST | `/api/tareas` | Crear nueva tarea |
| PUT | `/api/tareas/{id}` | Actualizar tarea |
| DELETE | `/api/tareas/{id}` | Eliminar tarea |

### Ejemplo de Peticiones

#### Crear Tarea
```bash
curl -X POST http://localhost:8000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi nueva tarea",
    "descripcion": "Descripción de la tarea",
    "estado": "Pendiente"
  }'
```

#### Obtener Tareas
```bash
curl http://localhost:8000/api/tareas
```

#### Marcar como Completada
```bash
curl -X PUT http://localhost:8000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"estado": "Completada"}'
```

## 🗄️ Base de Datos

### Esquema de la Tabla `Tareas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | Identificador único (auto-incremental) |
| Titulo | NVARCHAR(200) | Título de la tarea |
| Descripcion | NVARCHAR(MAX) | Descripción detallada |
| Estado | NVARCHAR(50) | Estado (Pendiente/En Progreso/Completada) |
| FechaCreacion | DATETIME | Fecha de creación |
| FechaActualizacion | DATETIME | Última actualización |

### Procedimientos Almacenados

- `sp_ObtenerTodasTareas` - Lista todas las tareas (con filtro opcional)
- `sp_ObtenerTareaPorId` - Obtiene una tarea por ID
- `sp_CrearTarea` - Crea una nueva tarea
- `sp_ActualizarTarea` - Actualiza una tarea existente
- `sp_EliminarTarea` - Elimina una tarea

## 🧪 Pruebas

### Probar Backend
```bash
# Verificar salud del servicio
curl http://localhost:8000/health

# Ver documentación interactiva
# Abrir en navegador: http://localhost:8000/docs
```

### Probar Frontend
1. Abrir http://localhost:3000
2. Crear una nueva tarea
3. Marcarla como completada
4. Filtrar por diferentes estados
5. Editar y eliminar tareas

### Probar App Móvil
1. Abrir Expo Go en tu dispositivo
2. Escanear el código QR
3. Probar todas las funcionalidades

## 🔧 Comandos Útiles

### Docker

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir contenedores
docker-compose up -d --build

# Eliminar volúmenes (resetear BD)
docker-compose down -v
```

### Acceder a SQL Server

```bash
docker exec -it sqlserver-tareas /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd"
```

## 🎨 Características Destacadas

### Backend
- ✅ API RESTful con FastAPI
- ✅ Validación de datos con Pydantic
- ✅ Uso de procedimientos almacenados
- ✅ Manejo de errores consistente
- ✅ CORS configurado
- ✅ Documentación automática (Swagger)

### Frontend
- ✅ Redux-Saga para manejo asíncrono
- ✅ Estados: loading, success, error
- ✅ Interfaz responsive
- ✅ Filtros en tiempo real
- ✅ Animaciones suaves
- ✅ Diseño moderno con gradientes

### Mobile
- ✅ Navegación fluida
- ✅ Pull-to-refresh
- ✅ Diseño nativo
- ✅ Gestión de estados de carga
- ✅ Confirmaciones de acciones

## 📄 Licencia

Este proyecto es parte de una prueba técnica.

## 👤 Malgar-1324

## 📞 Contacto +569 36267114

Para preguntas o sugerencias, contactar a [luiscarodev@gmail.com]

---
