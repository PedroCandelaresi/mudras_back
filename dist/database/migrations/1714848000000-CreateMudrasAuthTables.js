"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMudrasAuthTables1714848000000 = void 0;
class CreateMudrasAuthTables1714848000000 {
    constructor() {
        this.name = 'CreateMudrasAuthTables1714848000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_users (
          id CHAR(36) NOT NULL,
          username VARCHAR(191) NULL UNIQUE,
          email VARCHAR(191) NULL UNIQUE,
          password_hash VARCHAR(255) NULL,
          display_name VARCHAR(191) NOT NULL,
          user_type ENUM('EMPRESA','CLIENTE') NOT NULL DEFAULT 'EMPRESA',
          must_change_password TINYINT(1) NOT NULL DEFAULT 0,
          is_active TINYINT(1) NOT NULL DEFAULT 1,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_roles (
          id CHAR(36) NOT NULL,
          name VARCHAR(191) NOT NULL,
          slug VARCHAR(191) NOT NULL UNIQUE,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_permissions (
          id CHAR(36) NOT NULL,
          resource VARCHAR(191) NOT NULL,
          action VARCHAR(64) NOT NULL,
          description VARCHAR(255) NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          UNIQUE KEY uq_permission (resource, action),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_user_roles (
          user_id CHAR(36) NOT NULL,
          role_id CHAR(36) NOT NULL,
          PRIMARY KEY (user_id, role_id),
          CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES mudras_auth_users(id) ON DELETE CASCADE,
          CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES mudras_auth_roles(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_role_permissions (
          role_id CHAR(36) NOT NULL,
          permission_id CHAR(36) NOT NULL,
          PRIMARY KEY (role_id, permission_id),
          CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES mudras_auth_roles(id) ON DELETE CASCADE,
          CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES mudras_auth_permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_user_providers (
          id CHAR(36) NOT NULL,
          user_id CHAR(36) NOT NULL,
          provider ENUM('google','instagram') NOT NULL,
          provider_user_id VARCHAR(191) NOT NULL,
          email VARCHAR(191) NULL,
          access_token TEXT NULL,
          refresh_token TEXT NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          INDEX idx_provider_user (provider, provider_user_id),
          CONSTRAINT fk_user_providers_user FOREIGN KEY (user_id) REFERENCES mudras_auth_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS mudras_auth_refresh_tokens (
          id CHAR(36) NOT NULL,
          user_id CHAR(36) NOT NULL,
          token_hash VARCHAR(255) NOT NULL,
          expires_at DATETIME(6) NOT NULL,
          revoked TINYINT(1) NOT NULL DEFAULT 0,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          INDEX idx_token_user (user_id),
          CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES mudras_auth_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_refresh_tokens`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_user_providers`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_role_permissions`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_user_roles`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_permissions`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_roles`);
        await queryRunner.query(`DROP TABLE IF EXISTS mudras_auth_users`);
    }
}
exports.CreateMudrasAuthTables1714848000000 = CreateMudrasAuthTables1714848000000;
//# sourceMappingURL=1714848000000-CreateMudrasAuthTables.js.map