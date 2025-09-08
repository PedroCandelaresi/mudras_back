import { MigrationInterface, QueryRunner } from "typeorm";
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

export class SeedMudrasAuth1714848001000 implements MigrationInterface {
  name = 'SeedMudrasAuth1714848001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Roles iniciales
    const roles = [
      { name: 'ADMINISTRADOR', slug: 'administrador' },
      { name: 'DISENADORA', slug: 'disenadora' },
      { name: 'CAJA_REGISTRADORA', slug: 'caja_registradora' },
      { name: 'DEPOSITO', slug: 'deposito' },
      { name: 'TIENDA_ONLINE', slug: 'tienda_online' },
      { name: 'CLIENTE', slug: 'cliente' },
    ];

    const roleIds: Record<string, string> = {};
    for (const r of roles) {
      const id = randomUUID();
      roleIds[r.name] = id;
      await queryRunner.query(
        `INSERT INTO mudras_auth_roles (id, name, slug) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [id, r.name, r.slug]
      );
    }

    // Permisos base (ejemplo)
    const permissions: Array<{resource: string; action: string; description?: string}> = [
      { resource: 'usuarios', action: 'read' },
      { resource: 'usuarios', action: 'create' },
      { resource: 'usuarios', action: 'update' },
      { resource: 'usuarios', action: 'delete' },
      { resource: 'roles', action: 'read' },
      { resource: 'roles', action: 'assign' },
      { resource: 'productos', action: 'read' },
      { resource: 'productos', action: 'create' },
      { resource: 'productos', action: 'update' },
      { resource: 'productos', action: 'delete' },
      { resource: 'pedidos', action: 'read' },
      { resource: 'pedidos', action: 'update' },
      { resource: 'stock', action: 'read' },
      { resource: 'stock', action: 'update' },
      { resource: 'caja', action: 'read' },
      { resource: 'caja', action: 'create' },
      { resource: 'caja', action: 'close' },
      { resource: 'dashboard', action: 'read' },
      // Nuevos permisos alineados a resolvers protegidos
      { resource: 'ventas', action: 'read' },
      { resource: 'ventas', action: 'create' },
      { resource: 'ventas', action: 'update' },
      { resource: 'contabilidad', action: 'read' },
      { resource: 'contabilidad', action: 'create' },
      { resource: 'contabilidad', action: 'update' },
      { resource: 'cuentas', action: 'read' },
      { resource: 'cuentas', action: 'create' },
      { resource: 'cuentas', action: 'update' },
    ];

    const permissionIds: Record<string, string> = {};
    for (const p of permissions) {
      const id = randomUUID();
      permissionIds[`${p.resource}:${p.action}`] = id;
      await queryRunner.query(
        `INSERT INTO mudras_auth_permissions (id, resource, action, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)`,
        [id, p.resource, p.action, p.description ?? null]
      );
    }

    // Asignaciones de permisos por rol (simplificado)
    const assignAllToAdmin = Object.values(permissionIds);
    for (const permId of assignAllToAdmin) {
      await queryRunner.query(
        `INSERT IGNORE INTO mudras_auth_role_permissions (role_id, permission_id) VALUES (?, ?)`,
        [roleIds['ADMINISTRADOR'], permId]
      );
    }

    const allow = async (roleName: string, pairs: Array<[string,string]>) => {
      for (const [resource, action] of pairs) {
        const pid = permissionIds[`${resource}:${action}`];
        if (pid) {
          await queryRunner.query(
            `INSERT IGNORE INTO mudras_auth_role_permissions (role_id, permission_id) VALUES (?, ?)`,
            [roleIds[roleName], pid]
          );
        }
      }
    };

    await allow('DISENADORA', [
      ['productos','read'],['productos','create'],['productos','update'],['productos','delete'], ['dashboard','read']
    ]);
    await allow('CAJA_REGISTRADORA', [
      ['caja','read'],['caja','create'],['caja','close'], ['pedidos','read'],
      // Ventas operadas desde caja
      ['ventas','read'], ['ventas','create'], ['ventas','update'],
      // Cuentas corrientes desde caja
      ['cuentas','read'], ['cuentas','create'], ['cuentas','update'],
    ]);
    await allow('DEPOSITO', [
      ['stock','read'],['stock','update'], ['productos','read']
    ]);
    await allow('TIENDA_ONLINE', [
      ['productos','read'],['productos','update'], ['pedidos','read'],['pedidos','update'], ['dashboard','read'],
      // Lectura de ventas para reportes del canal online
      ['ventas','read'],
    ]);

    // Usuarios internos iniciales
    const users = [
      { username: 'administrador.mudras', display_name: 'Administrador Mudras', role: 'ADMINISTRADOR' },
      { username: 'diseñadora.mudras', display_name: 'Diseñadora Mudras', role: 'DISENADORA' },
      { username: 'caja.registradora', display_name: 'Caja Registradora', role: 'CAJA_REGISTRADORA' },
      { username: 'deposito.mudras', display_name: 'Depósito', role: 'DEPOSITO' },
      { username: 'tienda.online', display_name: 'Tienda Online', role: 'TIENDA_ONLINE' },
    ];

    const passwordHash = await bcrypt.hash('Cambiar123!', 10);

    for (const u of users) {
      const uid = randomUUID();
      await queryRunner.query(
        `INSERT INTO mudras_auth_users (id, username, display_name, user_type, password_hash, must_change_password, is_active) 
         VALUES (?, ?, ?, 'EMPRESA', ?, 1, 1)
         ON DUPLICATE KEY UPDATE display_name = VALUES(display_name)`,
        [uid, u.username, u.display_name, passwordHash]
      );
      await queryRunner.query(
        `INSERT IGNORE INTO mudras_auth_user_roles (user_id, role_id) 
         SELECT id, ? FROM mudras_auth_users WHERE username = ?` ,
        [roleIds[u.role], u.username]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Limpia datos sembrados (sin eliminar tablas)
    await queryRunner.query(`DELETE FROM mudras_auth_user_roles`);
    await queryRunner.query(`DELETE FROM mudras_auth_users`);
    await queryRunner.query(`DELETE FROM mudras_auth_role_permissions`);
    await queryRunner.query(`DELETE FROM mudras_auth_permissions`);
    await queryRunner.query(`DELETE FROM mudras_auth_roles`);
  }
}
