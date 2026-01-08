import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mudras_usuarios_auth_map')
export class UsuarioAuthMap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id', type: 'int' })
    usuarioId: number;

    @Column({ name: 'auth_user_id', type: 'char', length: 36 })
    authUserId: string;
}
