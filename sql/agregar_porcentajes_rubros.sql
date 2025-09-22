-- Migración: Agregar columnas de porcentajes a tabla tbrubros
-- Fecha: 2025-09-21
-- Descripción: Agrega columnas PorcentajeRecargo y PorcentajeDescuento para control de precios

ALTER TABLE `tbrubros` 
ADD COLUMN `PorcentajeRecargo` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Porcentaje de recargo sobre precio final del proveedor',
ADD COLUMN `PorcentajeDescuento` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Porcentaje de descuento sobre precio final de venta';

-- Verificar que las columnas se agregaron correctamente
DESCRIBE `tbrubros`;
