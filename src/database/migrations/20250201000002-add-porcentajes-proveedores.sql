-- Agrega columnas de recargo y descuento específicos por proveedor
ALTER TABLE tbproveedores
  ADD COLUMN PorcentajeRecargoProveedor DECIMAL(5,2) NOT NULL DEFAULT 0 AFTER Saldo,
  ADD COLUMN PorcentajeDescuentoProveedor DECIMAL(5,2) NOT NULL DEFAULT 0 AFTER PorcentajeRecargoProveedor;
