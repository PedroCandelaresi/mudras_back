-- Script de optimización: Índices y Foreign Keys para tablas proveedores-rubros-artículos
-- Fecha: 2025-09-21
-- Descripción: Optimiza la base de datos con índices estratégicos y foreign keys

-- ==========================================
-- 1. FOREIGN KEYS PARA INTEGRIDAD REFERENCIAL
-- ==========================================

-- FK: tbarticulos.idProveedor -> tbproveedores.IdProveedor
ALTER TABLE `tbarticulos` 
ADD CONSTRAINT `fk_articulos_proveedor` 
FOREIGN KEY (`idProveedor`) REFERENCES `tbproveedores`(`IdProveedor`) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- FK: tbarticulos.rubroId -> tbrubros.Id (campo nuevo)
ALTER TABLE `tbarticulos` 
ADD CONSTRAINT `fk_articulos_rubro_id` 
FOREIGN KEY (`rubroId`) REFERENCES `tbrubros`(`Id`) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- FK: tbproveedores.rubroId -> tbrubros.Id (campo nuevo)
ALTER TABLE `tbproveedores` 
ADD CONSTRAINT `fk_proveedores_rubro_id` 
FOREIGN KEY (`rubroId`) REFERENCES `tbrubros`(`Id`) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- FK: tb_proveedor_rubro.proveedor_id -> tbproveedores.IdProveedor
ALTER TABLE `tb_proveedor_rubro` 
ADD CONSTRAINT `fk_proveedor_rubro_proveedor` 
FOREIGN KEY (`proveedor_id`) REFERENCES `tbproveedores`(`IdProveedor`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- ==========================================
-- 2. ÍNDICES ESTRATÉGICOS PARA OPTIMIZACIÓN
-- ==========================================

-- Índice compuesto para consultas frecuentes: artículos por rubro y proveedor
CREATE INDEX `idx_articulos_rubro_proveedor` ON `tbarticulos` (`Rubro`, `idProveedor`);

-- Índice compuesto para búsquedas de artículos: código + descripción
CREATE INDEX `idx_articulos_busqueda` ON `tbarticulos` (`Codigo`, `Descripcion`);

-- Índice para consultas de stock y precios
CREATE INDEX `idx_articulos_stock_precio` ON `tbarticulos` (`Stock`, `PrecioVenta`);

-- Índice para proveedores por nombre (búsquedas frecuentes)
CREATE INDEX `idx_proveedores_nombre_codigo` ON `tbproveedores` (`Nombre`, `Codigo`);

-- Índice compuesto para tb_proveedor_rubro (consultas principales)
CREATE INDEX `idx_proveedor_rubro_consulta` ON `tb_proveedor_rubro` (`proveedor_id`, `rubro_nombre`);

-- Índice para búsquedas por rubro en tb_proveedor_rubro
CREATE INDEX `idx_proveedor_rubro_nombre` ON `tb_proveedor_rubro` (`rubro_nombre`);

-- Índice para rubros por nombre (único si no existe)
CREATE UNIQUE INDEX `idx_rubros_nombre_unique` ON `tbrubros` (`Rubro`);

-- ==========================================
-- 3. ÍNDICES PARA CAMPOS DE FECHA (PERFORMANCE)
-- ==========================================

-- Índice para fechas de modificación (reportes y auditoría)
CREATE INDEX `idx_articulos_fecha_modif` ON `tbarticulos` (`FechaModif`);

-- Índice para fechas de compra
CREATE INDEX `idx_articulos_fecha_compra` ON `tbarticulos` (`FechaCompra`);

-- ==========================================
-- 4. OPTIMIZACIÓN DE CONSULTAS EXISTENTES
-- ==========================================

-- Índice para mejorar consultas de conteo de artículos por rubro
CREATE INDEX `idx_articulos_rubro_count` ON `tbarticulos` (`Rubro`) WHERE `Rubro` IS NOT NULL;

-- Índice para mejorar consultas de proveedores activos
CREATE INDEX `idx_proveedores_activos` ON `tbproveedores` (`IdProveedor`, `Nombre`) WHERE `Nombre` IS NOT NULL;

-- ==========================================
-- 5. VERIFICACIÓN DE ÍNDICES CREADOS
-- ==========================================

-- Mostrar índices de tbarticulos
SHOW INDEX FROM `tbarticulos`;

-- Mostrar índices de tbproveedores  
SHOW INDEX FROM `tbproveedores`;

-- Mostrar índices de tbrubros
SHOW INDEX FROM `tbrubros`;

-- Mostrar índices de tb_proveedor_rubro
SHOW INDEX FROM `tb_proveedor_rubro`;

-- ==========================================
-- 6. ESTADÍSTICAS DE OPTIMIZACIÓN
-- ==========================================

-- Analizar tablas para actualizar estadísticas
ANALYZE TABLE `tbarticulos`;
ANALYZE TABLE `tbproveedores`;
ANALYZE TABLE `tbrubros`;
ANALYZE TABLE `tb_proveedor_rubro`;

-- ==========================================
-- NOTAS DE OPTIMIZACIÓN:
-- ==========================================
-- 1. Los FK garantizan integridad referencial
-- 2. Los índices compuestos optimizan consultas JOIN frecuentes
-- 3. Los índices de búsqueda mejoran filtros de texto
-- 4. Las estadísticas actualizadas mejoran el plan de ejecución
-- 5. ON DELETE SET NULL evita errores de integridad
-- 6. ON DELETE CASCADE limpia automáticamente relaciones
-- ==========================================
