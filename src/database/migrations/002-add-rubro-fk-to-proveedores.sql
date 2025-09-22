-- Migración para agregar FK rubroId a tabla tbproveedores
-- Paso 1: Agregar nueva columna rubroId
ALTER TABLE tbproveedores ADD COLUMN rubroId INT NULL;

-- Paso 2: Crear índice para mejorar performance
CREATE INDEX idx_tbproveedores_rubroId ON tbproveedores(rubroId);

-- Paso 3: Migrar datos existentes (mapear string Rubro a rubroId)
UPDATE tbproveedores p 
INNER JOIN tbrubros r ON p.Rubro = r.Rubro 
SET p.rubroId = r.Id 
WHERE p.Rubro IS NOT NULL AND p.Rubro != '';

-- Paso 4: Agregar constraint de FK
ALTER TABLE tbproveedores 
ADD CONSTRAINT fk_proveedores_rubro 
FOREIGN KEY (rubroId) REFERENCES tbrubros(Id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Paso 5: (Opcional) Eliminar columna string Rubro después de verificar migración
-- ALTER TABLE tbproveedores DROP COLUMN Rubro;
