"""
FastAPI Backend - Sistema de Gestión de Tareas
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="API Gestión de Tareas",
    description="API para gestionar tareas con FastAPI y SQL Server",
    version="1.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================
# Modelos Pydantic
# =============================================

class TareaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=200, description="Título de la tarea")
    descripcion: Optional[str] = Field(None, description="Descripción detallada")
    estado: Optional[str] = Field("Pendiente", pattern="^(Pendiente|Completada|En Progreso)$")

class TareaCreate(TareaBase):
    pass

class TareaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    descripcion: Optional[str] = None
    estado: Optional[str] = Field(None, pattern="^(Pendiente|Completada|En Progreso)$")

class TareaResponse(TareaBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

# =============================================
# Configuración Base de Datos
# =============================================

def get_db_connection():
    """Crear conexión a SQL Server"""
    try:
        server = os.getenv("DB_SERVER", "sqlserver")
        database = os.getenv("DB_NAME", "GestionTareas")
        username = os.getenv("DB_USER", "sa")
        password = os.getenv("DB_PASSWORD", "YourStrong@Passw0rd")
        
        connection_string = (
            f"DRIVER={{ODBC Driver 18 for SQL Server}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            f"UID={username};"
            f"PWD={password};"
            f"TrustServerCertificate=yes;"
        )
        
        conn = pyodbc.connect(connection_string)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión a BD: {str(e)}")

# =============================================
# Endpoints
# =============================================

@app.get("/")
def root():
    """Endpoint raíz"""
    return {
        "mensaje": "API de Gestión de Tareas",
        "version": "1.0.0",
        "documentacion": "/docs"
    }

@app.get("/api/tareas", response_model=List[TareaResponse])
def obtener_tareas(estado: Optional[str] = Query(None, description="Filtrar por estado")):
    """
    Obtener todas las tareas, con opción de filtrar por estado
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if estado:
            cursor.execute("EXEC sp_ObtenerTodasTareas @Estado=?", estado)
        else:
            cursor.execute("EXEC sp_ObtenerTodasTareas")
        
        tareas = []
        for row in cursor.fetchall():
            tareas.append({
                "id": row.Id,
                "titulo": row.Titulo,
                "descripcion": row.Descripcion,
                "estado": row.Estado,
                "fecha_creacion": row.FechaCreacion,
                "fecha_actualizacion": row.FechaActualizacion
            })
        
        cursor.close()
        conn.close()
        
        return tareas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tareas: {str(e)}")

@app.get("/api/tareas/{tarea_id}", response_model=TareaResponse)
def obtener_tarea(tarea_id: int):
    """
    Obtener una tarea específica por ID
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("EXEC sp_ObtenerTareaPorId @Id=?", tarea_id)
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        
        tarea = {
            "id": row.Id,
            "titulo": row.Titulo,
            "descripcion": row.Descripcion,
            "estado": row.Estado,
            "fecha_creacion": row.FechaCreacion,
            "fecha_actualizacion": row.FechaActualizacion
        }
        
        cursor.close()
        conn.close()
        
        return tarea
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tarea: {str(e)}")

@app.post("/api/tareas", response_model=TareaResponse, status_code=201)
def crear_tarea(tarea: TareaCreate):
    """
    Crear una nueva tarea
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "EXEC sp_CrearTarea @Titulo=?, @Descripcion=?, @Estado=?",
            tarea.titulo,
            tarea.descripcion,
            tarea.estado or "Pendiente"
        )
        
        row = cursor.fetchone()
        conn.commit()
        
        nueva_tarea = {
            "id": row.Id,
            "titulo": row.Titulo,
            "descripcion": row.Descripcion,
            "estado": row.Estado,
            "fecha_creacion": row.FechaCreacion,
            "fecha_actualizacion": row.FechaActualizacion
        }
        
        cursor.close()
        conn.close()
        
        return nueva_tarea
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear tarea: {str(e)}")

@app.put("/api/tareas/{tarea_id}", response_model=TareaResponse)
def actualizar_tarea(tarea_id: int, tarea: TareaUpdate):
    """
    Actualizar una tarea existente
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "EXEC sp_ActualizarTarea @Id=?, @Titulo=?, @Descripcion=?, @Estado=?",
            tarea_id,
            tarea.titulo,
            tarea.descripcion,
            tarea.estado
        )
        
        row = cursor.fetchone()
        conn.commit()
        
        if not row:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")
        
        tarea_actualizada = {
            "id": row.Id,
            "titulo": row.Titulo,
            "descripcion": row.Descripcion,
            "estado": row.Estado,
            "fecha_creacion": row.FechaCreacion,
            "fecha_actualizacion": row.FechaActualizacion
        }
        
        cursor.close()
        conn.close()
        
        return tarea_actualizada
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar tarea: {str(e)}")

@app.delete("/api/tareas/{tarea_id}", status_code=204)
def eliminar_tarea(tarea_id: int):
    """
    Eliminar una tarea
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("EXEC sp_EliminarTarea @Id=?", tarea_id)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar tarea: {str(e)}")

@app.get("/health")
def health_check():
    """Verificar estado del servicio"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
