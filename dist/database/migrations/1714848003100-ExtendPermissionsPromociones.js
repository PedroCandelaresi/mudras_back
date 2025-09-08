"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendPermissionsPromociones1714848003100 = void 0;
const crypto_1 = require("crypto");
class ExtendPermissionsPromociones1714848003100 {
    async up(queryRunner) {
        const perms = [
            { resource: 'promociones', action: 'read', description: 'Leer promociones' },
            { resource: 'promociones', action: 'create', description: 'Crear promociones' },
            { resource: 'promociones', action: 'update', description: 'Actualizar promociones' },
            { resource: 'promociones', action: 'delete', description: 'Eliminar promociones' },
        ];
        for (const p of perms) {
            const exists = await queryRunner.query(`SELECT id FROM mudras_auth_permissions WHERE resource = ? AND action = ? LIMIT 1`, [p.resource, p.action]);
            if (!exists?.length) {
                await queryRunner.query(`INSERT INTO mudras_auth_permissions (id, resource, action, description, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(6), NOW(6))`, [(0, crypto_1.randomUUID)(), p.resource, p.action, p.description]);
            }
        }
        const adminRows = await queryRunner.query(`SELECT id FROM mudras_auth_roles WHERE slug = 'administrador' LIMIT 1`);
        if (adminRows?.length) {
            const adminId = adminRows[0].id;
            const permRows = await queryRunner.query(`SELECT id FROM mudras_auth_permissions WHERE resource = 'promociones' AND action IN ('read','create','update','delete')`);
            for (const pr of permRows) {
                const rpExists = await queryRunner.query(`SELECT 1 FROM mudras_auth_role_permissions WHERE role_id = ? AND permission_id = ? LIMIT 1`, [adminId, pr.id]);
                if (!rpExists?.length) {
                    await queryRunner.query(`INSERT INTO mudras_auth_role_permissions (id, role_id, permission_id, created_at, updated_at) VALUES (?, ?, ?, NOW(6), NOW(6))`, [(0, crypto_1.randomUUID)(), adminId, pr.id]);
                }
            }
        }
    }
    async down(_queryRunner) {
    }
}
exports.ExtendPermissionsPromociones1714848003100 = ExtendPermissionsPromociones1714848003100;
//# sourceMappingURL=1714848003100-ExtendPermissionsPromociones.js.map