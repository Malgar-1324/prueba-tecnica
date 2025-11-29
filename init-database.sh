#!/bin/bash

echo "========================================="
echo "  INICIALIZADOR DE BASE DE DATOS"
echo "========================================="
echo ""

echo "[1/3] Verificando que SQL Server esté listo..."
sleep 5

echo "[2/3] Intentando inicializar la base de datos..."
echo ""

# Intentar método 1 (mssql-tools18)
echo "Método 1: Usando mssql-tools18..."
if docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /docker-entrypoint-initdb.d/init.sql 2>/dev/null; then
    echo ""
    echo "✅ Base de datos inicializada correctamente"
    exit 0
fi

# Intentar método 2 (mssql-tools legacy)
echo "Método 2: Usando mssql-tools..."
if docker exec sqlserver-tareas /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /docker-entrypoint-initdb.d/init.sql 2>/dev/null; then
    echo ""
    echo "✅ Base de datos inicializada correctamente"
    exit 0
fi

# Intentar método 3 (copiar y ejecutar)
echo "Método 3: Copiando script al contenedor..."
docker cp database/init.sql sqlserver-tareas:/tmp/init.sql
if docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /tmp/init.sql 2>/dev/null; then
    echo ""
    echo "✅ Base de datos inicializada correctamente"
    exit 0
fi

# Si todo falla
echo ""
echo "❌ No se pudo inicializar automáticamente"
echo ""
echo "Intenta manualmente:"
echo "  docker exec -it sqlserver-tareas bash"
echo "  /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C"
echo "  Luego pega el contenido de database/init.sql"
echo ""
exit 1
