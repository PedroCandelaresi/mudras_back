import { CreateClienteDto } from './create-cliente.dto';
declare const UpdateClienteDto_base: import("@nestjs/common").Type<Partial<CreateClienteDto>>;
export declare class UpdateClienteDto extends UpdateClienteDto_base {
    nombre?: string;
    apellido?: string;
    razonSocial?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
}
export {};
