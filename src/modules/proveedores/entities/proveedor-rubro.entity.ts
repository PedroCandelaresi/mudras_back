import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mudras_proveedor_rubro')
export class ProveedorRubro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'proveedor_id', type: 'int' })
    proveedorId: number;

    @Column({ name: 'rubro_nombre', type: 'varchar', length: 50 })
    rubroNombre: string;
}
