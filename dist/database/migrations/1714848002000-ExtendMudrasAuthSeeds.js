"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendMudrasAuthSeeds1714848002000 = void 0;
const crypto_1 = require("crypto");
class ExtendMudrasAuthSeeds1714848002000 {
    constructor() {
        this.name = 'ExtendMudrasAuthSeeds1714848002000';
    }
    async up(queryRunner) {
        const ensurePerm = async (resource, action, description = null) => {
            const found = await queryRunner.query(`SELECT id FROM mudras_auth_permissions WHERE resource = ? AND action = ? LIMIT 1`, [resource, action]);
            if (found.length > 0)
                return found[0].id;
            const id = (0, crypto_1.randomUUID)();
            await queryRunner.query(`INSERT INTO mudras_auth_permissions (id, resource, action, description) VALUES (?, ?, ?, ?)`, [id, resource, action, description]);
            return id;
        };
        const getRoleId = async (slug) => {
            const rows = await queryRunner.query(`SELECT id FROM mudras_auth_roles WHERE slug = ? LIMIT 1`, [slug]);
            return rows.length ? rows[0].id : null;
        };
        const assign = async (roleId, permId) => {
            await queryRunner.query(`INSERT IGNORE INTO mudras_auth_role_permissions (role_id, permission_id) VALUES (?, ?)`, [roleId, permId]);
        };
        const ventasRead = await ensurePerm('ventas', 'read');
        const ventasCreate = await ensurePerm('ventas', 'create');
        const ventasUpdate = await ensurePerm('ventas', 'update');
        const contRead = await ensurePerm('contabilidad', 'read');
        const contCreate = await ensurePerm('contabilidad', 'create');
        const contUpdate = await ensurePerm('contabilidad', 'update');
        const ctasRead = await ensurePerm('cuentas', 'read');
        const ctasCreate = await ensurePerm('cuentas', 'create');
        const ctasUpdate = await ensurePerm('cuentas', 'update');
        const adminId = await getRoleId('administrador');
        const cajaId = await getRoleId('caja_registradora');
        const tiendaId = await getRoleId('tienda_online');
        if (adminId) {
            for (const pid of [ventasRead, ventasCreate, ventasUpdate, contRead, contCreate, contUpdate, ctasRead, ctasCreate, ctasUpdate]) {
                await assign(adminId, pid);
            }
        }
        if (cajaId) {
            for (const pid of [ventasRead, ventasCreate, ventasUpdate, ctasRead, ctasCreate, ctasUpdate]) {
                await assign(cajaId, pid);
            }
        }
        if (tiendaId) {
            await assign(tiendaId, ventasRead);
        }
    }
    async down(_queryRunner) {
    }
}
exports.ExtendMudrasAuthSeeds1714848002000 = ExtendMudrasAuthSeeds1714848002000;
//# sourceMappingURL=1714848002000-ExtendMudrasAuthSeeds.js.map