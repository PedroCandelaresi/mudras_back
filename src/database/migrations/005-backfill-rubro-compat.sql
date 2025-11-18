-- Compatibility migration: add rubroId to tbproveedores and tbarticulos if missing
-- Uses INFORMATION_SCHEMA and prepared statements to support older MySQL versions

-- Set DB variable
SET @db = DATABASE();

-- 1) tbproveedores: add column if missing
SELECT COUNT(*) INTO @cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbproveedores' AND COLUMN_NAME = 'rubroId';
SET @sql = IF(@cnt = 0, 'ALTER TABLE tbproveedores ADD COLUMN rubroId INT NULL', 'SELECT 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create index if missing
SELECT COUNT(*) INTO @idx FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbproveedores' AND INDEX_NAME = 'idx_tbproveedores_rubroId';
SET @sql = IF(@idx = 0, 'CREATE INDEX idx_tbproveedores_rubroId ON tbproveedores(rubroId)', 'SELECT 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Backfill tbproveedores.rubroId using tb_proveedor_rubro (choose most frequent rubro per provider)
-- Simpler approach: correlated subquery picking the rubro_id with largest cantidad_articulos
UPDATE tbproveedores p
SET p.rubroId = (
  SELECT pr.rubro_id
  FROM tb_proveedor_rubro pr
  WHERE pr.proveedor_id = p.IdProveedor AND pr.rubro_id IS NOT NULL
  ORDER BY pr.cantidad_articulos DESC
  LIMIT 1
)
WHERE p.rubroId IS NULL;

-- 3) Map by string name when still null
UPDATE tbproveedores p
INNER JOIN tbrubros r ON p.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
SET p.rubroId = r.Id
WHERE p.rubroId IS NULL AND p.Rubro IS NOT NULL AND p.Rubro != '';

-- 4) tbarticulos: add column if missing
SELECT COUNT(*) INTO @cnt2 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbarticulos' AND COLUMN_NAME = 'rubroId';
SET @sql = IF(@cnt2 = 0, 'ALTER TABLE tbarticulos ADD COLUMN rubroId INT NULL', 'SELECT 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create index if missing
SELECT COUNT(*) INTO @idx2 FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbarticulos' AND INDEX_NAME = 'idx_tbarticulos_rubroId';
SET @sql = IF(@idx2 = 0, 'CREATE INDEX idx_tbarticulos_rubroId ON tbarticulos(rubroId)', 'SELECT 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 5) Backfill tbarticulos.rubroId from its own Rubro string (preferred)
UPDATE tbarticulos a
INNER JOIN tbrubros r ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
SET a.rubroId = r.Id
WHERE a.rubroId IS NULL AND a.Rubro IS NOT NULL AND a.Rubro != '';

-- 6) For remaining articles, fill from provider's rubroId
UPDATE tbarticulos a
LEFT JOIN tbproveedores p ON p.IdProveedor = a.idProveedor
SET a.rubroId = p.rubroId
WHERE a.rubroId IS NULL AND a.idProveedor IS NOT NULL;

-- 7) Attempt match from tb_proveedor_rubro by exact name
UPDATE tbarticulos a
LEFT JOIN tb_proveedor_rubro pr ON pr.proveedor_id = a.idProveedor AND pr.rubro_nombre COLLATE utf8mb4_unicode_ci = a.Rubro COLLATE utf8mb4_unicode_ci
SET a.rubroId = pr.rubro_id
WHERE a.rubroId IS NULL AND a.Rubro IS NOT NULL AND a.Rubro != '' AND a.idProveedor IS NOT NULL;

-- 8) Quick checks
SELECT 'ARTICULOS' AS tabla, COUNT(*) AS total, COUNT(rubroId) AS with_rubro FROM tbarticulos;
SELECT 'PROVEEDORES' AS tabla, COUNT(*) AS total, COUNT(rubroId) AS with_rubro FROM tbproveedores;
