-- =============================================
-- Script de Inicialización de Base de Datos
-- Sistema de Gestión de Tareas
-- =============================================

USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GestionTareas')
BEGIN
    CREATE DATABASE GestionTareas;
END
GO

USE GestionTareas;
GO

-- =============================================
-- Tabla: Tareas
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tareas' AND xtype='U')
BEGIN
    CREATE TABLE Tareas (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Titulo NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(MAX),
        Estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',
        FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
        FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT CK_Tareas_Estado CHECK (Estado IN ('Pendiente', 'Completada', 'En Progreso'))
    );
END
GO

-- =============================================
-- Procedimiento: sp_ObtenerTodasTareas
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ObtenerTodasTareas')
    DROP PROCEDURE sp_ObtenerTodasTareas;
GO

CREATE PROCEDURE sp_ObtenerTodasTareas
    @Estado NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Estado IS NULL OR @Estado = ''
    BEGIN
        SELECT 
            Id,
            Titulo,
            Descripcion,
            Estado,
            FechaCreacion,
            FechaActualizacion
        FROM Tareas
        ORDER BY FechaCreacion DESC;
    END
    ELSE
    BEGIN
        SELECT 
            Id,
            Titulo,
            Descripcion,
            Estado,
            FechaCreacion,
            FechaActualizacion
        FROM Tareas
        WHERE Estado = @Estado
        ORDER BY FechaCreacion DESC;
    END
END
GO

-- =============================================
-- Procedimiento: sp_ObtenerTareaPorId
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ObtenerTareaPorId')
    DROP PROCEDURE sp_ObtenerTareaPorId;
GO

CREATE PROCEDURE sp_ObtenerTareaPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Titulo,
        Descripcion,
        Estado,
        FechaCreacion,
        FechaActualizacion
    FROM Tareas
    WHERE Id = @Id;
END
GO

-- =============================================
-- Procedimiento: sp_CrearTarea
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CrearTarea')
    DROP PROCEDURE sp_CrearTarea;
GO

CREATE PROCEDURE sp_CrearTarea
    @Titulo NVARCHAR(200),
    @Descripcion NVARCHAR(MAX) = NULL,
    @Estado NVARCHAR(50) = 'Pendiente'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO Tareas (Titulo, Descripcion, Estado, FechaCreacion, FechaActualizacion)
        VALUES (@Titulo, @Descripcion, @Estado, GETDATE(), GETDATE());
        
        SELECT 
            Id,
            Titulo,
            Descripcion,
            Estado,
            FechaCreacion,
            FechaActualizacion
        FROM Tareas
        WHERE Id = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- =============================================
-- Procedimiento: sp_ActualizarTarea
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ActualizarTarea')
    DROP PROCEDURE sp_ActualizarTarea;
GO

CREATE PROCEDURE sp_ActualizarTarea
    @Id INT,
    @Titulo NVARCHAR(200) = NULL,
    @Descripcion NVARCHAR(MAX) = NULL,
    @Estado NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE Tareas
        SET 
            Titulo = COALESCE(@Titulo, Titulo),
            Descripcion = COALESCE(@Descripcion, Descripcion),
            Estado = COALESCE(@Estado, Estado),
            FechaActualizacion = GETDATE()
        WHERE Id = @Id;
        
        SELECT 
            Id,
            Titulo,
            Descripcion,
            Estado,
            FechaCreacion,
            FechaActualizacion
        FROM Tareas
        WHERE Id = @Id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- =============================================
-- Procedimiento: sp_EliminarTarea
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_EliminarTarea')
    DROP PROCEDURE sp_EliminarTarea;
GO

CREATE PROCEDURE sp_EliminarTarea
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Tareas WHERE Id = @Id;
END
GO

-- =============================================
-- Datos de Prueba
-- =============================================
INSERT INTO Tareas (Titulo, Descripcion, Estado) VALUES
('Implementar API REST', 'Crear endpoints para CRUD de tareas', 'En Progreso'),
('Configurar Docker', 'Dockerizar backend y frontend', 'Pendiente'),
('Crear interfaz móvil', 'Desarrollar app en React Native', 'Pendiente'),
('Documentar proyecto', 'Escribir README con instrucciones', 'Completada');

GO

PRINT 'Base de datos inicializada correctamente';
GO
