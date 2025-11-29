@echo off
echo =========================================
echo   INICIALIZADOR DE BASE DE DATOS
echo =========================================
echo.

echo [1/3] Verificando que SQL Server este listo...
timeout /t 5 /nobreak >nul

echo [2/3] Intentando inicializar la base de datos...
echo.

REM Intentar metodo 1 (mssql-tools18)
echo Metodo 1: Usando mssql-tools18...
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /docker-entrypoint-initdb.d/init.sql 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Base de datos inicializada correctamente
    goto :success
)

REM Intentar metodo 2 (mssql-tools legacy)
echo Metodo 2: Usando mssql-tools...
docker exec sqlserver-tareas /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /docker-entrypoint-initdb.d/init.sql 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Base de datos inicializada correctamente
    goto :success
)

REM Intentar metodo 3 (copiar y ejecutar)
echo Metodo 3: Copiando script al contenedor...
docker cp database\init.sql sqlserver-tareas:/tmp/init.sql
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -i /tmp/init.sql
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Base de datos inicializada correctamente
    goto :success
)

REM Si todo falla
echo.
echo [ERROR] No se pudo inicializar automaticamente
echo.
echo Intenta manualmente:
echo   docker exec -it sqlserver-tareas bash
echo   /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C
echo   Luego pega el contenido de database\init.sql
echo.
pause
exit /b 1

:success
echo.
echo [3/3] Verificando la base de datos...
docker exec sqlserver-tareas /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -Q "SELECT COUNT(*) as TotalTareas FROM GestionTareas.dbo.Tareas" 2>nul
echo.
echo =========================================
echo   INICIALIZACION COMPLETADA
echo =========================================
echo.
pause
