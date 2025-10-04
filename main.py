from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# Modelo Pydantic para bicicleta
class UsuarioIn(BaseModel):
    nombre: str
    email: str
    ciudad: str

class BicicletaIn(BaseModel):
    marca: str
    modelo: str
    precio: float
import psycopg2
from psycopg2.extras import RealDictCursor

# Conexión a PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="tienda_bicicletas",
    user="olider",
    password="esuvejes1"
)

app = FastAPI()

# Permitir CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# CRUD Usuarios
# -------------------------------

@app.get("/usuarios")
def get_usuarios():
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM usuarios;")
        return cur.fetchall()

@app.get("/usuarios/{id_usuario}")
def get_usuario(id_usuario: int):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM usuarios WHERE id_usuario = %s;", (id_usuario,))
        usuario = cur.fetchone()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario

@app.post("/usuarios")
def create_usuario(usuario: UsuarioIn):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO usuarios (nombre, email, ciudad) VALUES (%s, %s, %s) RETURNING id_usuario;",
            (usuario.nombre, usuario.email, usuario.ciudad)
        )
        conn.commit()
        return {"message": "Usuario creado correctamente"}

@app.put("/usuarios/{id_usuario}")
def update_usuario(id_usuario: int, usuario: UsuarioIn):
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE usuarios SET nombre=%s, email=%s, ciudad=%s WHERE id_usuario=%s;",
            (usuario.nombre, usuario.email, usuario.ciudad, id_usuario)
        )
        conn.commit()
        return {"message": "Usuario actualizado correctamente"}

@app.delete("/usuarios/{id_usuario}")
def delete_usuario(id_usuario: int):
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM usuarios WHERE id_usuario=%s;", (id_usuario,))
            conn.commit()
            return {"message": "Usuario eliminado correctamente"}
    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="No se puede eliminar el usuario porque tiene compras asociadas.")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")

# -------------------------------
# CRUD Bicicletas
# -------------------------------

@app.get("/bicicletas")
def get_bicicletas():
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM bicicletas;")
        return cur.fetchall()

@app.post("/bicicletas")
def create_bicicleta(bicicleta: BicicletaIn):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO bicicletas (marca, modelo, precio) VALUES (%s, %s, %s);",
            (bicicleta.marca, bicicleta.modelo, bicicleta.precio)
        )
        conn.commit()
        return {"message": "Bicicleta agregada correctamente"}

# -------------------------------
# CRUD Ventas
# -------------------------------

@app.get("/ventas")
def get_ventas():
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT v.id_venta, u.nombre AS cliente, v.fecha, v.total
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario;
        """)
        return cur.fetchall()

@app.post("/ventas")
def create_venta(id_usuario: int, fecha: str, total: float):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO ventas (id_usuario, fecha, total) VALUES (%s, %s, %s);",
            (id_usuario, fecha, total)
        )
        conn.commit()
        return {"message": "Venta registrada correctamente"}

# -------------------------------
# CRUD Pagos
# -------------------------------

@app.get("/pagos")
def get_pagos():
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT p.id_pago, v.id_venta, u.nombre AS cliente, p.metodo_pago, p.monto, p.fecha_pago
            FROM pagos p
            JOIN ventas v ON p.id_venta = v.id_venta
            JOIN usuarios u ON v.id_usuario = u.id_usuario;
        """)
        return cur.fetchall()

@app.post("/pagos")
def create_pago(id_venta: int, metodo_pago: str, monto: float, fecha_pago: str):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO pagos (id_venta, metodo_pago, monto, fecha_pago) VALUES (%s, %s, %s, %s);",
            (id_venta, metodo_pago, monto, fecha_pago)
        )
        conn.commit()
        return {"message": "Pago registrado correctamente"}


"http://localhost:8000"
"Documentación interactiva: http://localhost:8000/docs"

"uvicorn main:app --reload"


# 1. except psycopg2.errors.ForeignKeyViolation:
# Esto captura un error específico de la base de datos PostgreSQL: cuando intentas borrar (o modificar) un registro que está siendo referenciado por otra tabla (por una clave foránea).
# Por ejemplo, si intentas borrar un usuario que tiene ventas asociadas, PostgreSQL lanza este error.

# 2. conn.rollback()
# Cuando ocurre un error en una transacción de base de datos, la transacción queda en estado "aborted".
# conn.rollback() revierte cualquier cambio pendiente y deja la conexión lista para nuevas operaciones.
# Siempre debes hacer rollback después de un error en la base de datos.

# 3. cursor_factory=RealDictCursor
# Esto se usa al crear un cursor de PostgreSQL.

# Por defecto, los resultados de una consulta son tuplas.
# Con RealDictCursor, los resultados son diccionarios, donde puedes acceder a los datos por nombre de columna, por ejemplo: usuario['nombre'] en vez de usuario[0].
# 4. app.add_middleware(...)
# Esto agrega un middleware de CORS a tu app FastAPI.
# Permite que tu frontend (React) pueda hacer peticiones a tu backend (FastAPI) desde otro origen (dominio/puerto).

# 5. cur.fetchone()
# Después de ejecutar una consulta SQL, cur.fetchone() te da la primera fila del resultado (o None si no hay resultados).
# Se usa, por ejemplo, para obtener un solo usuario por su ID.