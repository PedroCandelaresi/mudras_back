import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
export declare class UsuariosService {
    private usuariosRepository;
    constructor(usuariosRepository: Repository<Usuario>);
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<Usuario | null>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
    remove(id: number): Promise<void>;
    login(loginDto: LoginDto): Promise<Usuario>;
    findByRol(rol: RolUsuario): Promise<Usuario[]>;
    createUsuariosEjemplo(): Promise<void>;
}
