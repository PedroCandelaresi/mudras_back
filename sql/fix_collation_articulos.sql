-- Script para corregir collations inconsistentes en las tablas
-- Problema: Illegal mix of collations (utf8mb4_unicode_ci,IMPLICIT) and (utf8mb4_general_ci,IMPLICIT)

-- 1. Verificar collations actuales
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLLATION_NAME
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'mudras' 
    AND TABLE_NAME IN ('tbarticulos', 'tbrubros', 'tbproveedores', 'tb_proveedor_rubro')
    AND COLLATION_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

-- 2. Estandarizar todas las columnas de texto a utf8mb4_unicode_ci

-- Tabla tbarticulos
ALTER TABLE tbarticulos 
MODIFY COLUMN Rubro VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Codigo VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Descripcion VARCHAR(500) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Marca VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Ubicacion VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Unidad VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN CodigoProv VARCHAR(255) COLLATE utf8mb4_unicode_ci;

-- Tabla tbrubros  
ALTER TABLE tbrubros
MODIFY COLUMN Rubro VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Codigo VARCHAR(255) COLLATE utf8mb4_unicode_ci;

-- Tabla tbproveedores
ALTER TABLE tbproveedores
MODIFY COLUMN Nombre VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Rubro VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Telefono VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Mail VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Celular VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Contacto VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN CP VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN CUIT VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Direccion VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Fax VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Localidad VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Observaciones VARCHAR(500) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Pais VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Provincia VARCHAR(255) COLLATE utf8mb4_unicode_ci,
MODIFY COLUMN Web VARCHAR(255) COLLATE utf8mb4_unicode_ci;

-- Tabla tb_proveedor_rubro
ALTER TABLE tb_proveedor_rubro
MODIFY COLUMN rubro_nombre VARCHAR(255) COLLATE utf8mb4_unicode_ci;

-- 3. Verificar que los cambios se aplicaron correctamente
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLLATION_NAME
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'mudras' 
    AND TABLE_NAME IN ('tbarticulos', 'tbrubros', 'tbproveedores', 'tb_proveedor_rubro')
    AND COLLATION_NAME IS NOT NULL
    AND COLLATION_NAME != 'utf8mb4_unicode_ci'
ORDER BY TABLE_NAME, COLUMN_NAME;
