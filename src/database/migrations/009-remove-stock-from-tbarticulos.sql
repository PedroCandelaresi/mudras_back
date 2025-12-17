-- Remove Stock column from tbarticulos as it is now handled by stock_puntos_mudras
ALTER TABLE tbarticulos DROP COLUMN Stock;
