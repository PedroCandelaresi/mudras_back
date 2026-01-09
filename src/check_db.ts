
import { AppDataSource } from './database/data-source';
import { PuntoMudras } from './modules/puntos-mudras/entities/punto-mudras.entity';

async function check() {
    try {
        console.log("Connecting to DB...");
        await AppDataSource.initialize();
        console.log("Connected!");

        const repo = AppDataSource.getRepository(PuntoMudras);
        const puntos = await repo.find();

        console.log(`Found ${puntos.length} Puntos Mudras:`);
        puntos.forEach(p => {
            console.log(`- [${p.id}] ${p.nombre} (${p.tipo}) Activo: ${p.activo}`);
        });

    } catch (error) {
        console.error("Error checking DB:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

check();
