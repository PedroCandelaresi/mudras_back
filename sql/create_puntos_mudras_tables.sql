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

-- Crear tabla movimientos_stock_puntos
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
    FOREIGN KEY (usuario_id) REFERENCES mudras_auth_users(id) ON DELETE SET NULL,
    INDEX idx_punto_origen (punto_mudras_origen_id),
    INDEX idx_punto_destino (punto_mudras_destino_id),
    INDEX idx_articulo (articulo_id),
    INDEX idx_tipo_movimiento (tipo_movimiento),
    INDEX idx_fecha_movimiento (fecha_movimiento)
);

-- Crear vista consolidada de stock por puntos
CREATE OR REPLACE VIEW vista_stock_puntos AS
SELECT 
    spm.id,
    spm.punto_mudras_id,
    pm.nombre as punto_nombre,
    pm.tipo as punto_tipo,
    spm.articulo_id,
    a.Codigo as articulo_codigo,
    a.Descripcion as articulo_descripcion,
    a.Rubro as articulo_rubro,
    a.PrecioVenta as articulo_precio,
    spm.cantidad,
    spm.stock_minimo,
    spm.stock_maximo,
    spm.fecha_actualizacion,
    CASE 
        WHEN spm.cantidad = 0 THEN 'SIN_STOCK'
        WHEN spm.cantidad <= spm.stock_minimo THEN 'BAJO'
        ELSE 'OK'
    END as estado_stock
FROM stock_puntos_mudras spm
JOIN puntos_mudras pm ON spm.punto_mudras_id = pm.id
JOIN tbarticulos a ON spm.articulo_id = a.id
WHERE pm.activo = TRUE;

-- Insertar datos de ejemplo
INSERT IGNORE INTO puntos_mudras (nombre, tipo, descripcion, direccion, permite_ventas_online, requiere_autorizacion) VALUES
('Tienda Online', 'venta', 'Tienda virtual para ventas online', 'Virtual', TRUE, FALSE),
('Tienda Física Principal', 'venta', 'Local principal en el centro', 'Av. Principal 123, Centro', FALSE, FALSE),
('Feria Artesanal', 'venta', 'Puesto en feria de fin de semana', 'Plaza Central, Feria Artesanal', FALSE, TRUE),
('Almacén Principal', 'deposito', 'Depósito principal de mercadería', 'Zona Industrial, Galpón 5', FALSE, FALSE),
('Depósito Secundario', 'deposito', 'Depósito auxiliar para overflow', 'Barrio Norte, Local 12', FALSE, FALSE);

-- Trigger para actualizar stock automáticamente en movimientos
DELIMITER //
CREATE TRIGGER IF NOT EXISTS actualizar_stock_movimiento 
AFTER INSERT ON movimientos_stock_puntos
FOR EACH ROW
BEGIN
    -- Solo procesar si es transferencia, entrada, salida o ajuste
    IF NEW.tipo_movimiento IN ('transferencia', 'entrada', 'salida', 'ajuste') THEN
        
        -- Actualizar stock origen (solo para transferencias y salidas)
        IF NEW.punto_mudras_origen_id IS NOT NULL AND NEW.tipo_movimiento IN ('transferencia', 'salida') THEN
            INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad, stock_minimo)
            VALUES (NEW.punto_mudras_origen_id, NEW.articulo_id, -NEW.cantidad, 0)
            ON DUPLICATE KEY UPDATE 
                cantidad = cantidad - NEW.cantidad,
                fecha_actualizacion = CURRENT_TIMESTAMP;
        END IF;
        
        -- Actualizar stock destino (para transferencias, entradas y ajustes)
        IF NEW.punto_mudras_destino_id IS NOT NULL THEN
            IF NEW.tipo_movimiento = 'ajuste' THEN
                -- Para ajustes, establecer la cantidad nueva directamente
                INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad, stock_minimo)
                VALUES (NEW.punto_mudras_destino_id, NEW.articulo_id, NEW.cantidad_nueva, 0)
                ON DUPLICATE KEY UPDATE 
                    cantidad = NEW.cantidad_nueva,
                    fecha_actualizacion = CURRENT_TIMESTAMP;
            ELSE
                -- Para transferencias y entradas, sumar la cantidad
                INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad, stock_minimo)
                VALUES (NEW.punto_mudras_destino_id, NEW.articulo_id, NEW.cantidad, 0)
                ON DUPLICATE KEY UPDATE 
                    cantidad = cantidad + NEW.cantidad,
                    fecha_actualizacion = CURRENT_TIMESTAMP;
            END IF;
        END IF;
    END IF;
END//
DELIMITER ;

-- Procedimiento para transferir stock entre puntos de forma segura
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS transferir_stock(
    IN p_punto_origen_id INT,
    IN p_punto_destino_id INT,
    IN p_articulo_id INT,
    IN p_cantidad DECIMAL(10,2),
    IN p_motivo VARCHAR(255),
    IN p_usuario_id CHAR(36)
)
BEGIN
    DECLARE v_stock_disponible DECIMAL(10,2) DEFAULT 0;
    DECLARE v_error_msg VARCHAR(255);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar que los puntos existen y están activos
    IF NOT EXISTS (SELECT 1 FROM puntos_mudras WHERE id = p_punto_origen_id AND activo = TRUE) THEN
        SET v_error_msg = CONCAT('Punto origen con ID ', p_punto_origen_id, ' no existe o no está activo');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_msg;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM puntos_mudras WHERE id = p_punto_destino_id AND activo = TRUE) THEN
        SET v_error_msg = CONCAT('Punto destino con ID ', p_punto_destino_id, ' no existe o no está activo');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_msg;
    END IF;
    
    -- Verificar stock disponible
    SELECT COALESCE(cantidad, 0) INTO v_stock_disponible
    FROM stock_puntos_mudras 
    WHERE punto_mudras_id = p_punto_origen_id AND articulo_id = p_articulo_id;
    
    IF v_stock_disponible < p_cantidad THEN
        SET v_error_msg = CONCAT('Stock insuficiente. Disponible: ', v_stock_disponible, ', Solicitado: ', p_cantidad);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_msg;
    END IF;
    
    -- Registrar el movimiento (el trigger se encargará de actualizar el stock)
    INSERT INTO movimientos_stock_puntos (
        punto_mudras_origen_id,
        punto_mudras_destino_id,
        articulo_id,
        tipo_movimiento,
        cantidad,
        motivo,
        usuario_id
    ) VALUES (
        p_punto_origen_id,
        p_punto_destino_id,
        p_articulo_id,
        'transferencia',
        p_cantidad,
        p_motivo,
        p_usuario_id
    );
    
    COMMIT;
END//
DELIMITER ;
