import { CreateUsuarioDto } from './create-usuario.dto';
declare const UpdateUsuarioDto_base: import("@nestjs/common").Type<Partial<CreateUsuarioDto>>;
export declare class UpdateUsuarioDto extends UpdateUsuarioDto_base {
    nombre?: string;
    apellido?: string;
    username?: string;
    email?: string;
    password?: string;
}
export {};
