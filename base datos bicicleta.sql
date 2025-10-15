-- Database: tienda_bicicletas

-- DROP DATABASE IF EXISTS tienda_bicicletas;

CREATE DATABASE Tienda_bicicletas
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
	
	-- Tabla Usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    ciudad VARCHAR(50)
);

-- Tabla Bicicletas
CREATE TABLE bicicletas (
    id_bicicleta SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

-- Tabla Ventas
CREATE TABLE ventas (
    id_venta SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    fecha DATE NOT NULL,
    total DECIMAL(10,2)
);

-- Tabla Detalle de Ventas
CREATE TABLE detalle_ventas (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT REFERENCES ventas(id_venta),
    id_bicicleta INT REFERENCES bicicletas(id_bicicleta),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);



-- Insertar Usuarios
INSERT INTO usuarios (nombre, email, ciudad) VALUES
('Carlos López', 'carlos@gmail.com', 'Bogotá'),
('Ana Martínez', 'ana@gmail.com', 'Medellín'),
('Pedro Gómez', 'pedro@gmail.com', 'Cali'),
('Laura Torres', 'laura@gmail.com', 'Barranquilla'),
('Andrés Ramírez', 'andres@gmail.com', 'Bogotá'),
('Sofía Pérez', 'sofia@gmail.com', 'Cartagena'),
('Jorge Ríos', 'jorge@gmail.com', 'Bucaramanga'),
('María Sánchez', 'maria@gmail.com', 'Medellín');

-- Insertar Bicicletas
INSERT INTO bicicletas (marca, modelo, precio) VALUES
('Trek', 'Marlin 7', 3500.00),
('Giant', 'Talon 3', 2800.00),
('Specialized', 'Rockhopper', 4000.00),
('Scott', 'Aspect 950', 3200.00),
('Cannondale', 'Trail 5', 3700.00),
('Merida', 'Big Nine 300', 2900.00),
('Santa Cruz', 'Chameleon', 5200.00),
('Bianchi', 'Nitron 9.4', 6100.00);

-- Insertar Ventas
INSERT INTO ventas (id_usuario, fecha, total) VALUES
(1, '2025-09-01', 6300.00),
(2, '2025-09-02', 2800.00),
(3, '2025-09-03', 7200.00),
(4, '2025-09-04', 3500.00),
(5, '2025-09-05', 6900.00),
(6, '2025-09-06', 2900.00),
(7, '2025-09-07', 4000.00),
(8, '2025-09-08', 3200.00);

-- Insertar Detalles de Ventas
INSERT INTO detalle_ventas (id_venta, id_bicicleta, cantidad, precio_unitario) VALUES
(1, 1, 1, 3500.00),
(1, 2, 1, 2800.00),
(2, 2, 1, 2800.00),
(3, 3, 1, 4000.00),
(3, 4, 1, 3200.00),
(4, 1, 1, 3500.00),
(5, 5, 1, 3700.00),
(5, 6, 1, 2900.00),
(6, 6, 1, 2900.00),
(7, 3, 1, 4000.00),
(8, 4, 1, 3200.00),
(1, 6, 1, 2900.00),
(2, 5, 1, 3700.00),
(3, 7, 1, 5200.00),
(4, 8, 1, 6100.00);

-- Historial de compras de un usuario:
SELECT u.nombre, v.fecha, b.marca, b.modelo, d.cantidad, d.precio_unitario
FROM usuarios u
JOIN ventas v ON u.id_usuario = v.id_usuario
JOIN detalle_ventas d ON v.id_venta = d.id_venta
JOIN bicicletas b ON d.id_bicicleta = b.id_bicicleta
WHERE u.nombre = 'Carlos López';


-- Total de bicicletas compradas por cada usuario:

SELECT u.nombre, SUM(d.cantidad) AS total_bicicletas
FROM usuarios u
JOIN ventas v ON u.id_usuario = v.id_usuario
JOIN detalle_ventas d ON v.id_venta = d.id_venta
GROUP BY u.nombre
ORDER BY total_bicicletas DESC;


-- nueva tabla de pagos
-- Tabla Pagos
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_venta INT REFERENCES ventas(id_venta),
    metodo_pago VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL
);


-- insertar informacion tabla pago
-- Insertar Pagos
INSERT INTO pagos (id_venta, metodo_pago, monto, fecha_pago) VALUES
(1, 'Tarjeta de crédito', 3500.00, '2025-09-01'),
(1, 'Efectivo', 2800.00, '2025-09-01'),
(2, 'Transferencia bancaria', 2800.00, '2025-09-02'),
(3, 'Tarjeta de débito', 4000.00, '2025-09-03'),
(3, 'Efectivo', 3200.00, '2025-09-03'),
(4, 'Tarjeta de crédito', 3500.00, '2025-09-04'),
(5, 'Transferencia bancaria', 6900.00, '2025-09-05'),
(6, 'Efectivo', 2900.00, '2025-09-06'),
(7, 'Tarjeta de débito', 4000.00, '2025-09-07'),
(8, 'Tarjeta de crédito', 3200.00, '2025-09-08');


--Consulta para ver qué método de pago utiliza más cada usuario:
SELECT u.nombre, p.metodo_pago, COUNT(*) AS veces_usado
FROM usuarios u
JOIN ventas v ON u.id_usuario = v.id_usuario
JOIN pagos p ON v.id_venta = p.id_venta
GROUP BY u.nombre, p.metodo_pago
ORDER BY u.nombre, veces_usado DESC;









