export declare class ListarUsuariosAuthInput {
    pagina?: number;
    limite?: number;
    busqueda?: string;
    username?: string;
    email?: string;
    nombre?: string;
    estado?: string;
}
export declare class UsuarioAuthResumenModel {
    id: string;
    username: string | null;
    email: string | null;
    displayName: string;
    userType: 'EMPRESA' | 'CLIENTE';
    isActive: boolean;
    mustChangePassword: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
}
export declare class UsuariosAuthPaginadosModel {
    items: UsuarioAuthResumenModel[];
    total: number;
}
export declare class UsuarioCajaAuthModel {
    id: string;
    username?: string | null;
    email?: string | null;
    displayName: string;
}
export declare class CrearUsuarioAuthInput {
    username: string;
    email?: string;
    displayName: string;
    passwordTemporal: string;
    isActive?: boolean;
    roles?: string[];
}
export declare class ActualizarUsuarioAuthInput {
    email?: string | null;
    displayName?: string;
    isActive?: boolean;
    roles?: string[];
}
