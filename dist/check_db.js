"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./database/data-source");
const punto_mudras_entity_1 = require("./modules/puntos-mudras/entities/punto-mudras.entity");
async function check() {
    try {
        console.log("Connecting to DB...");
        await data_source_1.AppDataSource.initialize();
        console.log("Connected!");
        const repo = data_source_1.AppDataSource.getRepository(punto_mudras_entity_1.PuntoMudras);
        const puntos = await repo.find();
        console.log(`Found ${puntos.length} Puntos Mudras:`);
        puntos.forEach(p => {
            console.log(`- [${p.id}] ${p.nombre} (${p.tipo}) Activo: ${p.activo}`);
        });
    }
    catch (error) {
        console.error("Error checking DB:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
check();
//# sourceMappingURL=check_db.js.map