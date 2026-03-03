import 'reflect-metadata';
import { AppDataSource } from '../database/data-source';

type Candidate = {
  id: number;
  Codigo: string | null;
  Descripcion: string | null;
  Rubro: string | null;
  Marca: string | null;
  Autor: string | null;
};

const hasArg = (name: string) => process.argv.includes(name);

async function main() {
  const dryRun = hasArg('--dry-run');
  const keepMarca = hasArg('--keep-marca');

  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();

  try {
    const candidatos = (await qr.query(
      `
      SELECT
        id,
        Codigo,
        Descripcion,
        Rubro,
        Marca,
        Autor
      FROM mudras_articulos
      WHERE LOWER(TRIM(COALESCE(Rubro, ''))) = 'libros'
        AND TRIM(COALESCE(Marca, '')) <> ''
        AND TRIM(COALESCE(Autor, '')) = ''
      ORDER BY id ASC
      `,
    )) as Candidate[];

    console.log(`[fix-libros-autor] Encontrados ${candidatos.length} artículos candidatos.`);

    if (candidatos.length === 0) {
      return;
    }

    const preview = candidatos.slice(0, 10);
    for (const c of preview) {
      console.log(
        ` - id=${c.id} codigo=${c.Codigo ?? '—'} marca="${c.Marca ?? ''}" -> autor`,
      );
    }
    if (candidatos.length > preview.length) {
      console.log(` ... y ${candidatos.length - preview.length} más`);
    }

    if (dryRun) {
      console.log('[fix-libros-autor] Modo dry-run: no se realizaron cambios.');
      return;
    }

    await qr.startTransaction();

    if (keepMarca) {
      await qr.query(
        `
        UPDATE mudras_articulos
        SET Autor = Marca
        WHERE LOWER(TRIM(COALESCE(Rubro, ''))) = 'libros'
          AND TRIM(COALESCE(Marca, '')) <> ''
          AND TRIM(COALESCE(Autor, '')) = ''
        `,
      );
    } else {
      await qr.query(
        `
        UPDATE mudras_articulos
        SET Autor = Marca,
            Marca = NULL
        WHERE LOWER(TRIM(COALESCE(Rubro, ''))) = 'libros'
          AND TRIM(COALESCE(Marca, '')) <> ''
          AND TRIM(COALESCE(Autor, '')) = ''
        `,
      );
    }

    await qr.commitTransaction();

    console.log(
      `[fix-libros-autor] OK. Registros actualizados: ${candidatos.length}. keepMarca=${keepMarca}`,
    );
  } catch (error) {
    if (qr.isTransactionActive) {
      await qr.rollbackTransaction();
    }
    console.error('[fix-libros-autor] Error:', error);
    process.exitCode = 1;
  } finally {
    await qr.release();
    await AppDataSource.destroy();
  }
}

void main();

