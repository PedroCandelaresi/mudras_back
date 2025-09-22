-- Script completo para migrar de relaciones string a FK
-- EJECUTAR EN ORDEN SECUENCIAL

-- ========================================
-- PASO 1: EJECUTAR MIGRACIONES DE ESTRUCTURA
-- ========================================

-- Migración 1: Agregar FK a tbarticulos
SOURCE /home/candelaresi/proyectos/mudras/backend/src/database/migrations/001-add-rubro-fk-to-articulos.sql;

-- Migración 2: Agregar FK a tbproveedores  
SOURCE /home/candelaresi/proyectos/mudras/backend/src/database/migrations/002-add-rubro-fk-to-proveedores.sql;

-- ========================================
-- PASO 2: VERIFICAR MIGRACIÓN DE DATOS
-- ========================================

-- Verificar que los datos se migraron correctamente
SELECT 
    'ARTICULOS' as tabla,
    COUNT(*) as total_registros,
    COUNT(rubroId) as con_rubro_fk,
    COUNT(Rubro) as con_rubro_string
FROM tbarticulos
UNION ALL
SELECT 
    'PROVEEDORES' as tabla,
    COUNT(*) as total_registros,
    COUNT(rubroId) as con_rubro_fk,
    COUNT(Rubro) as con_rubro_string
FROM tbproveedores;

-- ========================================
-- PASO 3: (OPCIONAL) ELIMINAR COLUMNAS STRING
-- ========================================
-- Solo ejecutar después de verificar que todo funciona correctamente

-- ALTER TABLE tbarticulos DROP COLUMN Rubro;
-- ALTER TABLE tbproveedores DROP COLUMN Rubro;

-- ========================================
-- PASO 4: VERIFICAR INTEGRIDAD REFERENCIAL
-- ========================================

-- Verificar que no hay FK huérfanas
SELECT 'ARTICULOS_HUERFANOS' as tipo, COUNT(*) as cantidad
FROM tbarticulos a 
LEFT JOIN tbrubros r ON a.rubroId = r.Id 
WHERE a.rubroId IS NOT NULL AND r.Id IS NULL
UNION ALL
SELECT 'PROVEEDORES_HUERFANOS' as tipo, COUNT(*) as cantidad
FROM tbproveedores p 
LEFT JOIN tbrubros r ON p.rubroId = r.Id 
WHERE p.rubroId IS NOT NULL AND r.Id IS NULL;
