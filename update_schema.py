
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="Tienda_bicicletas",
        user="postgres",
        password="123",
    )
    with conn.cursor() as cur:
        cur.execute("ALTER TABLE ventas ADD COLUMN descripcion VARCHAR(255);")
        conn.commit()
    print("Table 'ventas' altered successfully.")
except psycopg2.errors.DuplicateColumn:
    print("Column 'descripcion' already exists in 'ventas'.")
    pass
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()
