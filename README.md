# Backend - Mudras

## Reglas globales
- El nombre del proyecto es "Mudras" siempre.
- "panel" es el dashboard por defecto del sistema administrativo.
- Todas las tablas del frontend deben replicar la estética y funcionalidad de la tabla de Artículos. Como referencia/estándar usar `frontend/src/app/components/dashboards/mudras/TablaArticulos.tsx`. Pueden variar color, contenido y cantidad de columnas, pero no el comportamiento base.

Backend del sistema Mudras desarrollado con NestJS + GraphQL + TypeORM + MySQL.

## Configuración

- **Framework**: NestJS
- **API**: GraphQL (code-first)
- **Base de datos**: MySQL
- **ORM**: TypeORM
- **Node**: v22.16.0
- **npm**: 10.9.2

## Base de datos

- **Usuario**: mudras
- **Contraseña**: mudras2025
- **Database**: mudras
- **Host**: localhost
- **Puerto**: 3306

## Estructura

```
src/
├── modules/          # Módulos por dominio
├── common/           # Utilidades compartidas
├── config/           # Configuración
└── main.ts          # Punto de entrada
```

## Instalación

```bash
npm install
npm run start:dev
```

## Autenticación y OAuth

### JWT + Refresh Tokens
- Access token firmado con `JWT_SECRET` (expira según `JWT_EXPIRES_IN`, p.ej. `15m`).
- Refresh token opaco persistido en tabla `mudras_auth_refresh_tokens` con hash y rotación (expira según `JWT_REFRESH_EXPIRES_IN`, p.ej. `7d`).
- Endpoints:
  - `POST /auth/login` (internos EMPRESA, usuario/contraseña)
  - `POST /auth/refresh` (body: `{ refreshToken: string }`)
  - `POST /auth/logout` (body: `{ refreshToken: string }`)
  - `GET /auth/perfil` (protegido con JWT)

Variables (.env):
```
JWT_SECRET=change_me
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### OAuth Clientes (Google e Instagram)
Este flujo es exclusivo para usuarios `CLIENTE` (portal `/cliente`). Los internos `EMPRESA` usan login local.

Endoints:
- Google: `GET /auth/google` → callback `GET /auth/google/callback`
- Instagram: `GET /auth/instagram` → callback `GET /auth/instagram/callback`

Ambos callbacks:
1) Crean/actualizan usuario CLIENTE y vinculación en `mudras_auth_user_providers`.
2) Emite tokens (access + refresh) y setea cookies HTTP-only.
3) Redirige a `CLIENTE_PANEL_URL` (por defecto `/cliente/panel`).

Variables (.env):
```
# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Instagram (Basic Display)
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
INSTAGRAM_REDIRECT_URI=http://localhost:4000/auth/instagram/callback

# Redirección del portal cliente
CLIENTE_PANEL_URL=http://localhost:3000/cliente/panel
```

Notas importantes:
- El módulo registra las estrategias de OAuth de forma condicional. Si faltan las variables, la app no se cae (útil en dev). Completa el `.env` para habilitarlas.
- Si el email del proveedor coincide con un usuario interno `EMPRESA`, el login OAuth será rechazado.

### Prueba end-to-end local
1. Completa `backend/.env` con las variables anteriores y arranca `npm run start:dev`.
2. En frontend, establece `NEXT_PUBLIC_BACKEND_URL` en `frontend/.env` (p.ej. `http://localhost:4000`) y arranca `npm run dev`.
3. Abre `http://localhost:3000/cliente` y elige Google/Instagram.
4. Deberías terminar en `http://localhost:3000/cliente/panel` con cookies HTTP-only seteadas.

### CRUD Usuarios/Roles/Permisos
- Rutas protegidas por `JwtAuthGuard` + `RolesGuard` (`@Roles('administrador')`).
- Usuarios internos: `/users` (listar, crear, obtener, actualizar, eliminar, asignar roles).
- Roles: `/roles` + `POST /roles/:id/permissions` para asignación de permisos.
- Permisos: `/permissions` CRUD.
