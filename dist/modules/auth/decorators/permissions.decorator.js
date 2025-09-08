"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permisos = exports.PERMISOS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISOS_KEY = 'permisos';
const Permisos = (...permisos) => (0, common_1.SetMetadata)(exports.PERMISOS_KEY, permisos);
exports.Permisos = Permisos;
//# sourceMappingURL=permissions.decorator.js.map