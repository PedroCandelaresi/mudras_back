import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el username o email ya existen
    const existingUser = await this.usuariosRepository.findOne({
      where: [
        { username: createUsuarioDto.username },
        { email: createUsuarioDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('El username o email ya están en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      fechaIngreso: createUsuarioDto.fechaIngreso ? new Date(createUsuarioDto.fechaIngreso) : undefined,
    });

    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: ['cuentasCorrientes', 'asientosContables'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['cuentasCorrientes', 'asientosContables'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si se actualiza el password, hashearlo
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    // Verificar unicidad de username y email si se están actualizando
    if (updateUsuarioDto.username || updateUsuarioDto.email) {
      const existingUser = await this.usuariosRepository.findOne({
        where: [
          { username: updateUsuarioDto.username },
          { email: updateUsuarioDto.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El username o email ya están en uso');
      }
    }

    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
  }

  async login(loginDto: LoginDto): Promise<Usuario> {
    const usuario = await this.findByUsernameOrEmail(loginDto.usernameOrEmail);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();
    await this.usuariosRepository.save(usuario);

    return usuario;
  }

  async findByRol(rol: RolUsuario): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: { rol },
      order: { nombre: 'ASC' },
    });
  }

  async createUsuariosEjemplo(): Promise<void> {
    const usuariosEjemplo = [
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        username: 'admin',
        email: 'admin@mudras.com',
        password: 'admin123',
        rol: RolUsuario.ADMINISTRADOR,
        salario: 100000,
        fechaIngreso: '2024-01-01',
      },
      {
        nombre: 'Juan',
        apellido: 'Programador',
        username: 'jprogramador',
        email: 'programador@mudras.com',
        password: 'prog123',
        rol: RolUsuario.PROGRAMADOR,
        salario: 80000,
        fechaIngreso: '2024-01-15',
      },
      {
        nombre: 'María',
        apellido: 'Cajera',
        username: 'mcajera',
        email: 'caja@mudras.com',
        password: 'caja123',
        rol: RolUsuario.CAJA,
        salario: 45000,
        fechaIngreso: '2024-02-01',
      },
      {
        nombre: 'Carlos',
        apellido: 'Depósito',
        username: 'cdeposito',
        email: 'deposito@mudras.com',
        password: 'dep123',
        rol: RolUsuario.DEPOSITO,
        salario: 50000,
        fechaIngreso: '2024-02-15',
      },
      {
        nombre: 'Ana',
        apellido: 'Diseñadora',
        username: 'adisenadora',
        email: 'diseno@mudras.com',
        password: 'dis123',
        rol: RolUsuario.DIS_GRAFICO,
        salario: 60000,
        fechaIngreso: '2024-03-01',
      },
    ];

    for (const usuarioData of usuariosEjemplo) {
      const existingUser = await this.findByUsernameOrEmail(usuarioData.username);
      if (!existingUser) {
        await this.create(usuarioData as CreateUsuarioDto);
      }
    }
  }
}
