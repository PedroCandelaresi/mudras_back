"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOrigin = process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production'
        ? ['https://mudras.nqn.net.ar']
        : true;
    app.enableCors({
        origin: corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Secret-Key'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(4000, '0.0.0.0');
    console.log('🚀 Servidor GraphQL ejecutándose en http://0.0.0.0:4000/graphql');
}
bootstrap();
//# sourceMappingURL=main.js.map