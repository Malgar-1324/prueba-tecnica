# 🔧 SOLUCIÓN: Problema de Inicialización de Base de Datos

## ❌ Error Común:
```
OCI runtime exec failed: exec failed: unable to start container process: 
exec: "/opt/mssql-tools/bin/sqlcmd": stat /opt/mssql-tools/bin/sqlcmd: 
no such file or directory: unknown
```

## ✅ SOLUCIÓN RÁPIDA:

### Opción 1: Usar el Script Automático (MÁS FÁCIL)

**Windows:**
```cmd
init-database.bat
```

**Linux/Mac/Git Bash:**
```bash
bash init-database.sh
```

### Opción 2: Comando Directo

Prueba este comando (la ruta cambió en SQL Server 2022):

```bash
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /docker-entrypoint-initdb.d/init.sql
```

### Opción 3: Método que SIEMPRE Funciona

```bash
# 1. Copiar el script al contenedor
docker cp database/init.sql sqlserver-tareas:/tmp/init.sql

# 2. Ejecutarlo
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /tmp/init.sql
```

## 🎯 Pasos Completos Desde Cero:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Malgar-1324/prueba-tecnica.git
cd prueba-tecnica

# 2. Levantar servicios
docker-compose up -d

# 3. Esperar 30 segundos
# (para que SQL Server termine de iniciar)

# 4. Inicializar BD (Windows)
init-database.bat

# O (Linux/Mac/Git Bash)
bash init-database.sh

# 5. Verificar que funcionó
curl http://localhost:8000/api/tareas
```

## ✅ Deberías ver:

```json
[
  {
    "titulo": "Implementar API REST",
    "descripcion": "Crear endpoints para CRUD de tareas",
    "estado": "En Progreso",
    ...
  },
  ...
]
```

## 🆘 Si Nada Funciona:

1. **Entrar al contenedor manualmente:**
```bash
docker exec -it sqlserver-tareas bash
```

2. **Ejecutar sqlcmd interactivo:**
```bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C
```

3. **Copiar y pegar el contenido de `database/init.sql`**

4. **Escribir `GO` y presionar Enter**

## 📝 Notas:

- La ruta cambió de `/opt/mssql-tools/bin/sqlcmd` a `/opt/mssql-tools18/bin/sqlcmd` en SQL Server 2022
- El flag `-C` es necesario para certificados auto-firmados
- Los scripts automáticos prueban todas las variantes

## 🔍 Verificar Estado:

```bash
# Ver logs del contenedor
docker logs sqlserver-tareas

# Verificar que el contenedor esté healthy
docker ps

# Probar conexión a la BD
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -Q "SELECT @@VERSION"
```

---

**Problema resuelto ✅**  
Si sigue sin funcionar, comparte el error exacto que te aparece.
