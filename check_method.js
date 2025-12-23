
const fs = require('fs');
const path = '/home/candelaresi/Proyectos/Mudras/mudras_back/src/modules/puntos-mudras/puntos-mudras.service.ts';

if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf8');
    if (content.includes('asignarStockMasivo')) {
        console.log('FOUND: asignarStockMasivo exists in the file.');
        // Find line number
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('asignarStockMasivo')) {
                console.log(`Line ${index + 1}: ${line.trim()}`);
            }
        });
    } else {
        console.log('NOT FOUND: asignarStockMasivo does not exist in the file.');
    }
} else {
    console.log('File not found');
}
