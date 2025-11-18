-- Migration: 006-add-porcentajes-rubros.sql
-- Purpose: Ensure `tbrubros` contains PorcentajeRecargo and PorcentajeDescuento columns
-- This script is written to be compatible with MySQL servers that don't support
-- ALTER TABLE ... IF NOT EXISTS by checking INFORMATION_SCHEMA and using prepared statements.

SET @db = DATABASE();

-- Check and add PorcentajeRecargo if missing
SELECT COUNT(*) INTO @has_porcentaje_recargo
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbrubros' AND COLUMN_NAME = 'PorcentajeRecargo';

SET @sql_recargo = IF(@has_porcentaje_recargo = 0,
  'ALTER TABLE `tbrubros` ADD COLUMN `PorcentajeRecargo` DECIMAL(5,2) NOT NULL DEFAULT 0 AFTER `Codigo`',
  'SELECT 1');

PREPARE stmt_recargo FROM @sql_recargo;
EXECUTE stmt_recargo;
DEALLOCATE PREPARE stmt_recargo;

-- Check and add PorcentajeDescuento if missing
SELECT COUNT(*) INTO @has_porcentaje_desc
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbrubros' AND COLUMN_NAME = 'PorcentajeDescuento';

SET @sql_desc = IF(@has_porcentaje_desc = 0,
  'ALTER TABLE `tbrubros` ADD COLUMN `PorcentajeDescuento` DECIMAL(5,2) NOT NULL DEFAULT 0 AFTER `PorcentajeRecargo`',
  'SELECT 1');

PREPARE stmt_desc FROM @sql_desc;
EXECUTE stmt_desc;
DEALLOCATE PREPARE stmt_desc;

-- Verify
SELECT
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbrubros' AND COLUMN_NAME = 'PorcentajeRecargo') as has_porcentaje_recargo,
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'tbrubros' AND COLUMN_NAME = 'PorcentajeDescuento') as has_porcentaje_desc;
