-- Migration: add rubroId to tbproveedores and backfill from tb_proveedor_rubro,
-- then ensure tbarticulos.rubroId exists and backfill from provider mapping when missing.
-- Run this after a DB backup. It is idempotent for safe re-run in many cases.

-- 1) Add rubroId to tbproveedores if missing
ALTER TABLE tbproveedores
  ADD COLUMN IF NOT EXISTS rubroId INT NULL;

CREATE INDEX IF NOT EXISTS idx_tbproveedores_rubroId ON tbproveedores(rubroId);

-- 2) Backfill tbproveedores.rubroId using tb_proveedor_rubro
-- Choose the most frequent rubro_id for the provider (cantidad_articulos DESC)
UPDATE tbproveedores p
LEFT JOIN (
  SELECT pr.proveedor_id, pr.rubro_id
  FROM tb_proveedor_rubro pr
  WHERE pr.rubro_id IS NOT NULL
  GROUP BY pr.proveedor_id
  ORDER BY pr.proveedor_id, SUM(pr.cantidad_articulos) DESC
) pr_map ON pr_map.proveedor_id = p.IdProveedor
SET p.rubroId = COALESCE(p.rubroId, pr_map.rubro_id)
WHERE p.rubroId IS NULL;

-- If provider has no rubro_id in the relation table, try mapping by string name
UPDATE tbproveedores p
INNER JOIN tbrubros r ON p.Rubro = r.Rubro
SET p.rubroId = r.Id
WHERE p.rubroId IS NULL AND p.Rubro IS NOT NULL AND p.Rubro != '';

-- 3) Add rubroId to tbarticulos if missing
ALTER TABLE tbarticulos
  ADD COLUMN IF NOT EXISTS rubroId INT NULL;

CREATE INDEX IF NOT EXISTS idx_tbarticulos_rubroId ON tbarticulos(rubroId);

-- 4) Backfill tbarticulos.rubroId from its own Rubro string (preferred)
UPDATE tbarticulos a
INNER JOIN tbrubros r ON a.Rubro = r.Rubro
SET a.rubroId = r.Id
WHERE a.rubroId IS NULL AND a.Rubro IS NOT NULL AND a.Rubro != '';

-- 5) For remaining articles without rubroId, use the provider -> proveedor.rubroId mapping
UPDATE tbarticulos a
LEFT JOIN tbproveedores p ON p.IdProveedor = a.idProveedor
SET a.rubroId = p.rubroId
WHERE a.rubroId IS NULL AND a.idProveedor IS NOT NULL;

-- 6) For articles still without rubroId, attempt to match via tb_proveedor_rubro using exact Rubro name
UPDATE tbarticulos a
LEFT JOIN tb_proveedor_rubro pr ON pr.proveedor_id = a.idProveedor AND pr.rubro_nombre COLLATE utf8mb4_unicode_ci = a.Rubro COLLATE utf8mb4_unicode_ci
SET a.rubroId = pr.rubro_id
WHERE a.rubroId IS NULL AND a.Rubro IS NOT NULL AND a.Rubro != '' AND a.idProveedor IS NOT NULL;

-- 7) (Optional) Add FK constraints if you want referential integrity. Uncomment only after verification.
-- ALTER TABLE tbproveedores
--   ADD CONSTRAINT fk_proveedores_rubro FOREIGN KEY (rubroId) REFERENCES tbrubros(Id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE tbarticulos
--   ADD CONSTRAINT fk_articulos_rubro FOREIGN KEY (rubroId) REFERENCES tbrubros(Id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 8) Quick check counts
SELECT 'ARTICULOS' AS tabla, COUNT(*) AS total, COUNT(rubroId) AS with_rubro FROM tbarticulos;
SELECT 'PROVEEDORES' AS tabla, COUNT(*) AS total, COUNT(rubroId) AS with_rubro FROM tbproveedores;

-- End of migration
