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
