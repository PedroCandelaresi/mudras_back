import { UsuariosService } from './usuarios.service';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
export declare class UsuariosResolver {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    findByRol(rol: RolUsuario): Promise<Usuario[]>;
    updateUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
    removeUsuario(id: number): Promise<boolean>;
    login(loginDto: LoginDto): Promise<Usuario>;
    crearUsuariosEjemplo(): Promise<boolean>;
}
