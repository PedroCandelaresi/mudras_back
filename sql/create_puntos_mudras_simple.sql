-- Crear tabla puntos_mudras
CREATE TABLE IF NOT EXISTS puntos_mudras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('venta', 'deposito') NOT NULL,
    descripcion TEXT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    activo BOOLEAN DEFAULT TRUE,
    permite_ventas_online BOOLEAN DEFAULT FALSE,
    maneja_stock_fisico BOOLEAN DEFAULT TRUE,
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
);

-- Crear tabla stock_puntos_mudras
CREATE TABLE IF NOT EXISTS stock_puntos_mudras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    punto_mudras_id INT NOT NULL,
    articulo_id INT NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 0,
    stock_minimo DECIMAL(10,2) DEFAULT 0,
    stock_maximo DECIMAL(10,2) NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (punto_mudras_id) REFERENCES puntos_mudras(id) ON DELETE CASCADE,
    FOREIGN KEY (articulo_id) REFERENCES tbarticulos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_punto_articulo (punto_mudras_id, articulo_id),
    INDEX idx_punto_mudras (punto_mudras_id),
    INDEX idx_articulo (articulo_id),
    INDEX idx_cantidad (cantidad)
);

-- Crear tabla movimientos_stock_puntos (sin foreign key a usuarios por ahora)
CREATE TABLE IF NOT EXISTS movimientos_stock_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    punto_mudras_origen_id INT NULL,
    punto_mudras_destino_id INT NULL,
    articulo_id INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida', 'transferencia', 'ajuste', 'venta', 'devolucion') NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    cantidad_anterior DECIMAL(10,2) NULL,
    cantidad_nueva DECIMAL(10,2) NULL,
    motivo VARCHAR(255) NULL,
    referencia_externa VARCHAR(100) NULL,
    usuario_id CHAR(36) NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (punto_mudras_origen_id) REFERENCES puntos_mudras(id) ON DELETE SET NULL,
    FOREIGN KEY (punto_mudras_destino_id) REFERENCES puntos_mudras(id) ON DELETE SET NULL,
    FOREIGN KEY (articulo_id) REFERENCES tbarticulos(id) ON DELETE CASCADE,
    INDEX idx_punto_origen (punto_mudras_origen_id),
    INDEX idx_punto_destino (punto_mudras_destino_id),
    INDEX idx_articulo (articulo_id),
    INDEX idx_tipo_movimiento (tipo_movimiento),
    INDEX idx_fecha_movimiento (fecha_movimiento)
);

-- Insertar datos de ejemplo
INSERT IGNORE INTO puntos_mudras (nombre, tipo, descripcion, direccion, permite_ventas_online, requiere_autorizacion) VALUES
('Tienda Online', 'venta', 'Tienda virtual para ventas online', 'Virtual', TRUE, FALSE),
('Tienda Física Principal', 'venta', 'Local principal en el centro', 'Av. Principal 123, Centro', FALSE, FALSE),
('Feria Artesanal', 'venta', 'Puesto en feria de fin de semana', 'Plaza Central, Feria Artesanal', FALSE, TRUE),
('Almacén Principal', 'deposito', 'Depósito principal de mercadería', 'Zona Industrial, Galpón 5', FALSE, FALSE),
('Depósito Secundario', 'deposito', 'Depósito auxiliar para overflow', 'Barrio Norte, Local 12', FALSE, FALSE);
