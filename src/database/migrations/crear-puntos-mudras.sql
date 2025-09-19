-- Migración: Crear sistema de Puntos Mudras
-- Fecha: 2024-09-17
-- Descripción: Sistema de gestión de puntos de venta y depósitos con stock distribuido

-- 1. Tabla principal de puntos Mudras
CREATE TABLE puntos_mudras (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('venta', 'deposito') NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  permite_ventas_online BOOLEAN DEFAULT FALSE,
  maneja_stock_fisico BOOLEAN DEFAULT TRUE,
  requiere_autorizacion BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo),
  INDEX idx_activo (activo),
  INDEX idx_nombre (nombre)
);

-- 2. Tabla de stock por punto Mudras
CREATE TABLE stock_puntos_mudras (
  id INT PRIMARY KEY AUTO_INCREMENT,
  punto_mudras_id INT NOT NULL,
  articulo_id INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_minimo DECIMAL(10,2) DEFAULT 0,
  stock_maximo DECIMAL(10,2) DEFAULT NULL,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (punto_mudras_id) REFERENCES puntos_mudras(id) ON DELETE CASCADE,
  FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_punto_articulo (punto_mudras_id, articulo_id),
  INDEX idx_punto_mudras (punto_mudras_id),
  INDEX idx_articulo (articulo_id),
  INDEX idx_cantidad (cantidad)
);

-- 3. Tabla de movimientos de stock entre puntos
CREATE TABLE movimientos_stock_puntos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  punto_mudras_origen_id INT,
  punto_mudras_destino_id INT,
  articulo_id INT NOT NULL,
  tipo_movimiento ENUM('entrada', 'salida', 'transferencia', 'ajuste', 'venta', 'devolucion') NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  cantidad_anterior DECIMAL(10,2),
  cantidad_nueva DECIMAL(10,2),
  motivo VARCHAR(255),
  referencia_externa VARCHAR(100), -- ID de venta, orden, etc.
  usuario_id INT,
  fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (punto_mudras_origen_id) REFERENCES puntos_mudras(id),
  FOREIGN KEY (punto_mudras_destino_id) REFERENCES puntos_mudras(id),
  FOREIGN KEY (articulo_id) REFERENCES articulos(id),
  INDEX idx_fecha (fecha_movimiento),
  INDEX idx_tipo (tipo_movimiento),
  INDEX idx_articulo (articulo_id),
  INDEX idx_origen (punto_mudras_origen_id),
  INDEX idx_destino (punto_mudras_destino_id)
);

-- 4. Insertar puntos Mudras por defecto
INSERT INTO puntos_mudras (nombre, tipo, descripcion, direccion, email, permite_ventas_online, maneja_stock_fisico) VALUES
('Tienda Online', 'venta', 'Plataforma de e-commerce principal', 'Virtual', 'ventas@mudras.com', TRUE, FALSE),
('Tienda Física Centro', 'venta', 'Local comercial en el centro de la ciudad', 'Av. Principal 123, Centro', 'centro@mudras.com', FALSE, TRUE),
('Depósito Principal', 'deposito', 'Almacén central de mercadería', 'Zona Industrial Km 15', 'deposito@mudras.com', FALSE, TRUE);

-- 5. Trigger para actualizar stock en movimientos
DELIMITER $$
CREATE TRIGGER actualizar_stock_movimiento
AFTER INSERT ON movimientos_stock_puntos
FOR EACH ROW
BEGIN
  -- Actualizar stock del punto origen (si existe)
  IF NEW.punto_mudras_origen_id IS NOT NULL THEN
    INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad)
    VALUES (NEW.punto_mudras_origen_id, NEW.articulo_id, -NEW.cantidad)
    ON DUPLICATE KEY UPDATE 
    cantidad = cantidad - NEW.cantidad,
    fecha_actualizacion = CURRENT_TIMESTAMP;
  END IF;
  
  -- Actualizar stock del punto destino (si existe)
  IF NEW.punto_mudras_destino_id IS NOT NULL THEN
    INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad)
    VALUES (NEW.punto_mudras_destino_id, NEW.articulo_id, NEW.cantidad)
    ON DUPLICATE KEY UPDATE 
    cantidad = cantidad + NEW.cantidad,
    fecha_actualizacion = CURRENT_TIMESTAMP;
  END IF;
END$$
DELIMITER ;

-- 6. Vista para consultar stock consolidado por punto
CREATE VIEW vista_stock_puntos AS
SELECT 
  pm.id as punto_id,
  pm.nombre as punto_nombre,
  pm.tipo as punto_tipo,
  a.id as articulo_id,
  a.Codigo as articulo_codigo,
  a.Descripcion as articulo_descripcion,
  a.Rubro as articulo_rubro,
  COALESCE(spm.cantidad, 0) as cantidad_actual,
  COALESCE(spm.stock_minimo, 0) as stock_minimo,
  COALESCE(spm.stock_maximo, 0) as stock_maximo,
  CASE 
    WHEN COALESCE(spm.cantidad, 0) <= COALESCE(spm.stock_minimo, 0) THEN 'BAJO'
    WHEN COALESCE(spm.cantidad, 0) = 0 THEN 'SIN_STOCK'
    ELSE 'OK'
  END as estado_stock,
  spm.fecha_actualizacion
FROM puntos_mudras pm
CROSS JOIN articulos a
LEFT JOIN stock_puntos_mudras spm ON pm.id = spm.punto_mudras_id AND a.id = spm.articulo_id
WHERE pm.activo = TRUE AND pm.maneja_stock_fisico = TRUE;

-- 7. Procedimiento para transferir stock entre puntos
DELIMITER $$
CREATE PROCEDURE transferir_stock(
  IN p_punto_origen INT,
  IN p_punto_destino INT,
  IN p_articulo_id INT,
  IN p_cantidad DECIMAL(10,2),
  IN p_motivo VARCHAR(255),
  IN p_usuario_id INT
)
BEGIN
  DECLARE v_stock_origen DECIMAL(10,2) DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
  
  -- Verificar stock disponible en origen
  SELECT COALESCE(cantidad, 0) INTO v_stock_origen
  FROM stock_puntos_mudras 
  WHERE punto_mudras_id = p_punto_origen AND articulo_id = p_articulo_id;
  
  IF v_stock_origen < p_cantidad THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente en punto origen';
  END IF;
  
  -- Registrar movimiento
  INSERT INTO movimientos_stock_puntos (
    punto_mudras_origen_id, 
    punto_mudras_destino_id, 
    articulo_id, 
    tipo_movimiento, 
    cantidad, 
    motivo, 
    usuario_id
  ) VALUES (
    p_punto_origen, 
    p_punto_destino, 
    p_articulo_id, 
    'transferencia', 
    p_cantidad, 
    p_motivo, 
    p_usuario_id
  );
  
  COMMIT;
END$$
DELIMITER ;
