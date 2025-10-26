import psycopg2
import os

def update_database():
    db_name = "Tienda_bicicletas"
    try:
        # --- 1. Connect to the database ---
        conn = psycopg2.connect(
            host="localhost",
            database=db_name,
            user="postgres",
            password="123",
        )
        print(f"Connected to '{db_name}' database")

        with conn.cursor() as cur:
            # --- 2. Drop all tables ---
            tables = ['pagos', 'detalle_ventas', 'ventas', 'bicicletas', 'usuarios']
            for table in tables:
                cur.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                print(f"Dropped table {table}.")

            # --- 3. Execute the SQL script ---
            sql_file_path = os.path.join(os.path.dirname(__file__), 'base datos bicicleta.sql')

            with open(sql_file_path, 'r', encoding='utf-8') as f:
                sql_content = f.read()
                # Find the start of the table creation
                create_table_index = sql_content.find("CREATE TABLE")
                if create_table_index != -1:
                    sql_content = sql_content[create_table_index:]
                else:
                    raise ValueError("Could not find 'CREATE TABLE' in the SQL script.")

            cur.execute(sql_content)
            conn.commit()
            print("Database schema and data inserted successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()
            print(f"Connection to '{db_name}' database closed.")


if __name__ == "__main__":
    update_database()
