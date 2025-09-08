import { MigrationInterface, QueryRunner } from 'typeorm';
import { randomUUID } from 'crypto';

export class ExtendMudrasAuthSeeds1714848002000 implements MigrationInterface {
  name = 'ExtendMudrasAuthSeeds1714848002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper: ensure permission exists and return id
    const ensurePerm = async (resource: string, action: string, description: string | null = null): Promise<string> => {
      const found: Array<{ id: string }> = await queryRunner.query(
        `SELECT id FROM mudras_auth_permissions WHERE resource = ? AND action = ? LIMIT 1`,
        [resource, action],
      );
      if (found.length > 0) return found[0].id;
      const id = randomUUID();
      await queryRunner.query(
        `INSERT INTO mudras_auth_permissions (id, resource, action, description) VALUES (?, ?, ?, ?)`,
        [id, resource, action, description],
      );
      return id;
    };

    // Helper: get role id by slug
    const getRoleId = async (slug: string): Promise<string | null> => {
      const rows: Array<{ id: string }> = await queryRunner.query(
        `SELECT id FROM mudras_auth_roles WHERE slug = ? LIMIT 1`,
        [slug],
      );
      return rows.length ? rows[0].id : null;
    };

    // Helper: assign permission to role (idempotente)
    const assign = async (roleId: string, permId: string) => {
      await queryRunner.query(
        `INSERT IGNORE INTO mudras_auth_role_permissions (role_id, permission_id) VALUES (?, ?)`,
        [roleId, permId],
      );
    };

    // Crear/asegurar permisos nuevos alineados a resolvers
    const ventasRead = await ensurePerm('ventas', 'read');
    const ventasCreate = await ensurePerm('ventas', 'create');
    const ventasUpdate = await ensurePerm('ventas', 'update');

    const contRead = await ensurePerm('contabilidad', 'read');
    const contCreate = await ensurePerm('contabilidad', 'create');
    const contUpdate = await ensurePerm('contabilidad', 'update');

    const ctasRead = await ensurePerm('cuentas', 'read');
    const ctasCreate = await ensurePerm('cuentas', 'create');
    const ctasUpdate = await ensurePerm('cuentas', 'update');

    // Asignaciones por rol
    const adminId = await getRoleId('administrador');
    const cajaId = await getRoleId('caja_registradora');
    const tiendaId = await getRoleId('tienda_online');

    // ADMIN: asignar todos los nuevos permisos
    if (adminId) {
      for (const pid of [ventasRead, ventasCreate, ventasUpdate, contRead, contCreate, contUpdate, ctasRead, ctasCreate, ctasUpdate]) {
        await assign(adminId, pid);
      }
    }

    // CAJA_REGISTRADORA: ventas.* y cuentas.*
    if (cajaId) {
      for (const pid of [ventasRead, ventasCreate, ventasUpdate, ctasRead, ctasCreate, ctasUpdate]) {
        await assign(cajaId, pid);
      }
    }

    // TIENDA_ONLINE: ventas.read
    if (tiendaId) {
      await assign(tiendaId, ventasRead);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // No se eliminan datos para mantener idempotencia y evitar pérdida de permisos
  }
}
