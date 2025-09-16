-- Migración para crear tablas del módulo Caja Registradora
-- Fecha: 2024-12-01
-- Descripción: Crea todas las tablas necesarias para el sistema de caja registradora

-- Tabla de puestos de venta
CREATE TABLE `puestos_venta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `descontar_stock` tinyint(1) NOT NULL DEFAULT 1,
  `permitir_venta_sin_stock` tinyint(1) NOT NULL DEFAULT 0,
  `requiere_cliente` tinyint(1) NOT NULL DEFAULT 0,
  `emitir_comprobante_afip` tinyint(1) NOT NULL DEFAULT 1,
  `punto_venta_afip` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_puestos_venta_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas de caja
CREATE TABLE `ventas_caja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_venta` varchar(20) NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo_venta` enum('MOSTRADOR','DELIVERY','ONLINE','TELEFONICA') NOT NULL DEFAULT 'MOSTRADOR',
  `estado` enum('PENDIENTE','CONFIRMADA','CANCELADA','DEVUELTA','DEVUELTA_PARCIAL') NOT NULL DEFAULT 'PENDIENTE',
  `puesto_venta_id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `descuento_porcentaje` decimal(5,2) NOT NULL DEFAULT 0.00,
  `descuento_monto` decimal(12,2) NOT NULL DEFAULT 0.00,
  `impuestos` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cambio` decimal(12,2) NOT NULL DEFAULT 0.00,
  `observaciones` text,
  `venta_original_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ventas_caja_numero` (`numero_venta`),
  KEY `IDX_ventas_caja_fecha` (`fecha`),
  KEY `IDX_ventas_caja_estado` (`estado`),
  KEY `IDX_ventas_caja_puesto_venta` (`puesto_venta_id`),
  KEY `IDX_ventas_caja_cliente` (`cliente_id`),
  KEY `IDX_ventas_caja_usuario` (`usuario_id`),
  KEY `FK_ventas_caja_venta_original` (`venta_original_id`),
  CONSTRAINT `FK_ventas_caja_puesto_venta` FOREIGN KEY (`puesto_venta_id`) REFERENCES `puestos_venta` (`id`),
  -- CONSTRAINT `FK_ventas_caja_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  -- CONSTRAINT `FK_ventas_caja_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FK_ventas_caja_venta_original` FOREIGN KEY (`venta_original_id`) REFERENCES `ventas_caja` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalles de venta de caja
CREATE TABLE `detalles_venta_caja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venta_id` int NOT NULL,
  `articulo_id` int NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `descuento_porcentaje` decimal(5,2) NOT NULL DEFAULT 0.00,
  `descuento_monto` decimal(12,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL,
  `observaciones` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_detalles_venta_caja_venta` (`venta_id`),
  KEY `IDX_detalles_venta_caja_articulo` (`articulo_id`),
  CONSTRAINT `FK_detalles_venta_caja_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas_caja` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_detalles_venta_caja_articulo` FOREIGN KEY (`articulo_id`) REFERENCES `tbarticulos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de pagos de caja
CREATE TABLE `pagos_caja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venta_id` int NOT NULL,
  `metodo_pago` enum('EFECTIVO','TARJETA_DEBITO','TARJETA_CREDITO','TRANSFERENCIA','CHEQUE','CUENTA_CORRIENTE','OTRO') NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `numero_tarjeta_ultimos_4` varchar(4) DEFAULT NULL,
  `tipo_tarjeta` varchar(50) DEFAULT NULL,
  `numero_cuotas` int DEFAULT NULL,
  `observaciones` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_pagos_caja_venta` (`venta_id`),
  KEY `IDX_pagos_caja_metodo` (`metodo_pago`),
  CONSTRAINT `FK_pagos_caja_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas_caja` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de comprobantes AFIP
CREATE TABLE `comprobantes_afip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venta_id` int NOT NULL,
  `tipo_comprobante` enum('FACTURA_A','FACTURA_B','FACTURA_C','NOTA_CREDITO_A','NOTA_CREDITO_B','NOTA_CREDITO_C','NOTA_DEBITO_A','NOTA_DEBITO_B','NOTA_DEBITO_C','RECIBO_A','RECIBO_B','RECIBO_C') NOT NULL,
  `punto_venta` int NOT NULL,
  `numero_comprobante` int DEFAULT NULL,
  `estado` enum('PENDIENTE','AUTORIZADO','RECHAZADO','ERROR') NOT NULL DEFAULT 'PENDIENTE',
  `cae` varchar(14) DEFAULT NULL,
  `fecha_vencimiento_cae` date DEFAULT NULL,
  `fecha_emision` datetime DEFAULT NULL,
  `importe_total` decimal(12,2) NOT NULL,
  `url_pdf` varchar(500) DEFAULT NULL,
  `mensaje_error` text,
  `intentos_emision` int NOT NULL DEFAULT 0,
  `ultimo_intento` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_comprobantes_afip_venta` (`venta_id`),
  KEY `IDX_comprobantes_afip_estado` (`estado`),
  KEY `IDX_comprobantes_afip_cae` (`cae`),
  CONSTRAINT `FK_comprobantes_afip_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas_caja` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de movimientos de inventario para caja registradora
CREATE TABLE `movimientos_inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articulo_id` int NOT NULL,
  `puesto_venta_id` int DEFAULT NULL,
  `venta_caja_id` int DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `tipo_movimiento` enum('VENTA','DEVOLUCION','AJUSTE','TRANSFERENCIA','INICIAL') NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `precio_venta` decimal(12,2) DEFAULT NULL,
  `numero_comprobante` varchar(50) DEFAULT NULL,
  `observaciones` text,
  `fecha` datetime NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_movimientos_inventario_articulo` (`articulo_id`),
  KEY `IDX_movimientos_inventario_puesto_venta` (`puesto_venta_id`),
  KEY `IDX_movimientos_inventario_venta_caja` (`venta_caja_id`),
  KEY `IDX_movimientos_inventario_usuario` (`usuario_id`),
  KEY `IDX_movimientos_inventario_fecha` (`fecha`),
  KEY `IDX_movimientos_inventario_tipo` (`tipo_movimiento`),
  CONSTRAINT `FK_movimientos_inventario_articulo` FOREIGN KEY (`articulo_id`) REFERENCES `tbarticulos` (`id`),
  CONSTRAINT `FK_movimientos_inventario_puesto_venta` FOREIGN KEY (`puesto_venta_id`) REFERENCES `puestos_venta` (`id`),
  CONSTRAINT `FK_movimientos_inventario_venta_caja` FOREIGN KEY (`venta_caja_id`) REFERENCES `ventas_caja` (`id`)
  -- CONSTRAINT `FK_movimientos_inventario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de snapshots mensuales de inventario
CREATE TABLE `snapshots_inventario_mensual` (
  `id` int NOT NULL AUTO_INCREMENT,
  `articulo_id` int NOT NULL,
  `puesto_venta_id` int DEFAULT NULL,
  `año` int NOT NULL,
  `mes` int NOT NULL,
  `stock_inicial` decimal(10,3) NOT NULL DEFAULT 0.000,
  `entradas` decimal(10,3) NOT NULL DEFAULT 0.000,
  `salidas` decimal(10,3) NOT NULL DEFAULT 0.000,
  `ajustes` decimal(10,3) NOT NULL DEFAULT 0.000,
  `stock_final` decimal(10,3) NOT NULL DEFAULT 0.000,
  `stock_calculado` decimal(10,3) NOT NULL DEFAULT 0.000,
  `discrepancia` decimal(10,3) NOT NULL DEFAULT 0.000,
  `fecha_cierre` datetime NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_snapshots_inventario_articulo_puesto_periodo` (`articulo_id`,`puesto_venta_id`,`año`,`mes`),
  KEY `IDX_snapshots_inventario_articulo` (`articulo_id`),
  KEY `IDX_snapshots_inventario_puesto_venta` (`puesto_venta_id`),
  KEY `IDX_snapshots_inventario_periodo` (`año`,`mes`),
  CONSTRAINT `FK_snapshots_inventario_articulo` FOREIGN KEY (`articulo_id`) REFERENCES `tbarticulos` (`id`),
  CONSTRAINT `FK_snapshots_inventario_puesto_venta` FOREIGN KEY (`puesto_venta_id`) REFERENCES `puestos_venta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos iniciales
INSERT INTO `puestos_venta` (`nombre`, `descripcion`, `activo`, `descontar_stock`, `permitir_venta_sin_stock`, `requiere_cliente`, `emitir_comprobante_afip`, `punto_venta_afip`) VALUES
('Mostrador Principal', 'Punto de venta principal del local', 1, 1, 0, 0, 1, 1),
('Delivery', 'Ventas por delivery', 1, 1, 0, 1, 1, 2),
('Online', 'Ventas a través de la tienda online', 1, 1, 0, 1, 1, 3),
('Eventos', 'Ventas en ferias y eventos', 1, 0, 1, 0, 0, NULL);
