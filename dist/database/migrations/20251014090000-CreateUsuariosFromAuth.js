"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsuariosFromAuth20251014090000 = void 0;
class CreateUsuariosFromAuth20251014090000 {
    constructor() {
        this.name = 'CreateUsuariosFromAuth20251014090000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('administrador','programador','caja','deposito','dis_grafico') NOT NULL DEFAULT 'caja',
        estado ENUM('activo','inactivo','suspendido') NOT NULL DEFAULT 'activo',
        telefono VARCHAR(20) NULL,
        direccion TEXT NULL,
        salario DECIMAL(10,2) NOT NULL DEFAULT 0,
        fechaIngreso DATE NULL,
        ultimoAcceso DATETIME NULL,
        creadoEn DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        actualizadoEn DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY uq_username (username),
        UNIQUE KEY uq_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS usuarios_auth_map (
        usuario_id INT NOT NULL,
        auth_user_id CHAR(36) NOT NULL,
        PRIMARY KEY (usuario_id),
        UNIQUE KEY uq_auth_user (auth_user_id),
        CONSTRAINT fk_map_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        await queryRunner.query(`
      INSERT INTO usuarios (nombre, apellido, username, email, password, rol, estado, salario)
      SELECT
        SUBSTRING_INDEX(COALESCE(u.display_name, u.username, 'Usuario'), ' ', 1) AS nombre,
        TRIM(SUBSTRING(COALESCE(u.display_name, u.username, ''), LENGTH(SUBSTRING_INDEX(COALESCE(u.display_name, u.username, ''), ' ', 1)) + 1)) AS apellido,
        COALESCE(u.username, CONCAT('user_', LEFT(u.id, 8))) AS username,
        COALESCE(u.email, CONCAT(COALESCE(u.username, LEFT(u.id, 8)), '@mudras.local')) AS email,
        '$2b$10$TU7AIbl2xuQxjV82whRkIe/D6c1q5MNszBnvos3jVRn3sKRV18nY2' AS password,
        CASE
          WHEN EXISTS (
            SELECT 1 FROM mudras_auth_user_roles ur JOIN mudras_auth_roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id AND r.slug = 'administrador'
          ) THEN 'administrador'
          WHEN EXISTS (
            SELECT 1 FROM mudras_auth_user_roles ur JOIN mudras_auth_roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id AND r.slug = 'caja_registradora'
          ) THEN 'caja'
          WHEN EXISTS (
            SELECT 1 FROM mudras_auth_user_roles ur JOIN mudras_auth_roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id AND r.slug = 'deposito'
          ) THEN 'deposito'
          WHEN EXISTS (
            SELECT 1 FROM mudras_auth_user_roles ur JOIN mudras_auth_roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id AND r.slug = 'disenadora'
          ) THEN 'dis_grafico'
          ELSE 'caja'
        END AS rol,
        CASE WHEN u.is_active = 1 THEN 'activo' ELSE 'inactivo' END AS estado,
        0.00 AS salario
      FROM mudras_auth_users u
      WHERE u.user_type = 'EMPRESA'
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        apellido = VALUES(apellido),
        email = VALUES(email),
        rol = VALUES(rol),
        estado = VALUES(estado),
        actualizadoEn = CURRENT_TIMESTAMP(6);
    `);
        await queryRunner.query(`
      INSERT IGNORE INTO usuarios_auth_map (usuario_id, auth_user_id)
      SELECT u.id, au.id
      FROM usuarios u
      JOIN mudras_auth_users au ON au.username = u.username;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS usuarios_auth_map`);
        await queryRunner.query(`DROP TABLE IF EXISTS usuarios`);
    }
}
exports.CreateUsuariosFromAuth20251014090000 = CreateUsuariosFromAuth20251014090000;
//# sourceMappingURL=20251014090000-CreateUsuariosFromAuth.js.map