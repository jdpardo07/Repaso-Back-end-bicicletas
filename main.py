from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# Modelo Pydantic para bicicleta
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
def create_usuario(nombre: str, email: str, ciudad: str):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO usuarios (nombre, email, ciudad) VALUES (%s, %s, %s) RETURNING id_usuario;",
            (nombre, email, ciudad)
        )
        conn.commit()
        return {"message": "Usuario creado correctamente"}

@app.put("/usuarios/{id_usuario}")
def update_usuario(id_usuario: int, nombre: str, email: str, ciudad: str):
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE usuarios SET nombre=%s, email=%s, ciudad=%s WHERE id_usuario=%s;",
            (nombre, email, ciudad, id_usuario)
        )
        conn.commit()
        return {"message": "Usuario actualizado correctamente"}

@app.delete("/usuarios/{id_usuario}")
def delete_usuario(id_usuario: int):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM usuarios WHERE id_usuario=%s;", (id_usuario,))
        conn.commit()
        return {"message": "Usuario eliminado correctamente"}

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