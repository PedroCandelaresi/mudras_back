# Backend - Mudras

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
