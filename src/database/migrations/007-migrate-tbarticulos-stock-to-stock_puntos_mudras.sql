-- Migration: 007-migrate-tbarticulos-stock-to-stock_puntos_mudras.sql
-- Purpose: Migrate stock quantities from `tbarticulos.Stock` into `stock_puntos_mudras` for punto_mudras_id = 1.
-- Strategy:
-- 1) Update existing `stock_puntos_mudras` records for punto 1 to match `tbarticulos.Stock`.
-- 2) Insert missing `stock_puntos_mudras` rows for punto 1 using `tbarticulos.Stock`.
-- 3) Provide verification queries at the end.

START TRANSACTION;

-- 1) Update existing stock_puntos_mudras rows for punto 1
UPDATE stock_puntos_mudras sp
JOIN tbarticulos a ON sp.articulo_id = a.id
SET sp.cantidad = COALESCE(a.Stock, 0)
WHERE sp.punto_mudras_id = 1;

-- 2) Insert missing rows for punto 1
INSERT INTO stock_puntos_mudras (punto_mudras_id, articulo_id, cantidad, stock_minimo)
SELECT 1 AS punto_mudras_id, a.id AS articulo_id, COALESCE(a.Stock, 0) AS cantidad, 0 AS stock_minimo
FROM tbarticulos a
LEFT JOIN stock_puntos_mudras sp ON sp.articulo_id = a.id AND sp.punto_mudras_id = 1
WHERE sp.id IS NULL;

COMMIT;

-- Verification: counts and sample rows
SELECT COUNT(*) AS total_articulos FROM tbarticulos;
SELECT COUNT(*) AS total_stock_punto1 FROM stock_puntos_mudras WHERE punto_mudras_id = 1;
SELECT a.id, a.Codigo, a.Descripcion, a.Stock AS articuloStock, sp.cantidad AS stockPunto1
FROM tbarticulos a
LEFT JOIN stock_puntos_mudras sp ON sp.articulo_id = a.id AND sp.punto_mudras_id = 1
ORDER BY a.id
LIMIT 20;

-- NOTE:
-- If you also want to migrate quantities from legacy `tbStock` table (if present),
-- run a separate aggregation and decide whether tbStock or tbarticulos is the source of truth.
