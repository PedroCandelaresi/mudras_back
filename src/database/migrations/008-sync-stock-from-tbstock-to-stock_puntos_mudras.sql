-- Migration: 008-sync-stock-from-tbstock-to-stock_puntos_mudras.sql
-- Purpose: Replace punto 1 entries in stock_puntos_mudras with current non-zero stock
-- derived from the latest records in `tbStock` (one row per Codigo with max Id).

-- Safety: create a backup table with the current punto 1 snapshot before changes.

START TRANSACTION;

-- Backup current punto 1 stock
DROP TABLE IF EXISTS stock_puntos_mudras_punto1_backup;
CREATE TABLE stock_puntos_mudras_punto1_backup AS
SELECT * FROM stock_puntos_mudras WHERE punto_mudras_id = 1;

-- Remove existing records for punto 1
DELETE FROM stock_puntos_mudras WHERE punto_mudras_id = 1;

-- Insert only articles that have a non-zero latest tbStock entry
-- Determine latest tbStock row per Codigo by max(Id)
INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad, stock_minimo)
SELECT
  1 AS punto_mudras_id,
  a.id AS articulo_id,
  s.Stock AS cantidad,
  0 AS stock_minimo
FROM (
  SELECT t.Codigo, t.Stock
  FROM tbStock t
  INNER JOIN (
    SELECT Codigo, MAX(Id) AS maxId
    FROM tbStock
    GROUP BY Codigo
  ) latest ON latest.Codigo = t.Codigo AND latest.maxId = t.Id
) s
INNER JOIN tbarticulos a ON a.Codigo COLLATE utf8mb4_unicode_ci = s.Codigo COLLATE utf8mb4_unicode_ci
WHERE COALESCE(s.Stock, 0) > 0;

COMMIT;

-- Verification
SELECT COUNT(*) AS total_stock_punto1_after FROM stock_puntos_mudras WHERE punto_mudras_id = 1;
SELECT COUNT(*) AS total_articles_in_tbstock FROM (
  SELECT Codigo FROM tbStock GROUP BY Codigo
) x;
SELECT a.id, a.Codigo, a.Descripcion, sp.cantidad
FROM stock_puntos_mudras sp
JOIN tbarticulos a ON a.id = sp.articulo_id
WHERE sp.punto_mudras_id = 1
ORDER BY a.id
LIMIT 20;

-- Notes:
-- - This migration will remove any punto 1 stock rows for articles that do not have a positive latest value in tbStock.
-- - A backup table `stock_puntos_mudras_punto1_backup` is created in case you need to restore previous values.
