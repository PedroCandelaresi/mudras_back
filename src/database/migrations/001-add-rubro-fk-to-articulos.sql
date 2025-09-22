-- Migración para agregar FK rubroId a tabla tbarticulos
-- Paso 1: Agregar nueva columna rubroId
ALTER TABLE tbarticulos ADD COLUMN rubroId INT NULL;

-- Paso 2: Crear índice para mejorar performance
CREATE INDEX idx_tbarticulos_rubroId ON tbarticulos(rubroId);

-- Paso 3: Migrar datos existentes (mapear string Rubro a rubroId)
UPDATE tbarticulos a 
INNER JOIN tbrubros r ON a.Rubro = r.Rubro 
SET a.rubroId = r.Id 
WHERE a.Rubro IS NOT NULL AND a.Rubro != '';

-- Paso 4: Agregar constraint de FK
ALTER TABLE tbarticulos 
ADD CONSTRAINT fk_articulos_rubro 
FOREIGN KEY (rubroId) REFERENCES tbrubros(Id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Paso 5: (Opcional) Eliminar columna string Rubro después de verificar migración
-- ALTER TABLE tbarticulos DROP COLUMN Rubro;
