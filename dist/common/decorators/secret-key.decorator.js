"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireSecretKey = void 0;
const common_1 = require("@nestjs/common");
const secret_key_guard_1 = require("../guards/secret-key.guard");
const RequireSecretKey = () => (0, common_1.UseGuards)(secret_key_guard_1.SecretKeyGuard);
exports.RequireSecretKey = RequireSecretKey;
//# sourceMappingURL=secret-key.decorator.js.map