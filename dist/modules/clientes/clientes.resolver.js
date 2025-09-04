"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const clientes_service_1 = require("./clientes.service");
const cliente_entity_1 = require("./entities/cliente.entity");
const create_cliente_dto_1 = require("./dto/create-cliente.dto");
const update_cliente_dto_1 = require("./dto/update-cliente.dto");
const secret_key_decorator_1 = require("../../common/decorators/secret-key.decorator");
let ClientesResolver = class ClientesResolver {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    createCliente(createClienteDto) {
        return this.clientesService.create(createClienteDto);
    }
    findAll() {
        return this.clientesService.findAll();
    }
    findOne(id) {
        return this.clientesService.findOne(id);
    }
    findByTipo(tipo) {
        return this.clientesService.findByTipo(tipo);
    }
    findByEstado(estado) {
        return this.clientesService.findByEstado(estado);
    }
    findMorosos() {
        return this.clientesService.findMorosos();
    }
    buscarPorNombre(nombre) {
        return this.clientesService.buscarPorNombre(nombre);
    }
    updateCliente(id, updateClienteDto) {
        return this.clientesService.update(id, updateClienteDto);
    }
    actualizarSaldoCliente(id, nuevoSaldo) {
        return this.clientesService.actualizarSaldo(id, nuevoSaldo);
    }
    async removeCliente(id) {
        await this.clientesService.remove(id);
        return true;
    }
};
exports.ClientesResolver = ClientesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cliente_entity_1.Cliente),
    __param(0, (0, graphql_1.Args)('createClienteInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "createCliente", null);
__decorate([
    (0, graphql_1.Query)(() => [cliente_entity_1.Cliente], { name: 'clientes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => cliente_entity_1.Cliente, { name: 'cliente' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [cliente_entity_1.Cliente], { name: 'clientesPorTipo' }),
    __param(0, (0, graphql_1.Args)('tipo', { type: () => cliente_entity_1.TipoCliente })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "findByTipo", null);
__decorate([
    (0, graphql_1.Query)(() => [cliente_entity_1.Cliente], { name: 'clientesPorEstado' }),
    __param(0, (0, graphql_1.Args)('estado', { type: () => cliente_entity_1.EstadoCliente })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "findByEstado", null);
__decorate([
    (0, graphql_1.Query)(() => [cliente_entity_1.Cliente], { name: 'clientesMorosos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "findMorosos", null);
__decorate([
    (0, graphql_1.Query)(() => [cliente_entity_1.Cliente], { name: 'buscarClientesPorNombre' }),
    __param(0, (0, graphql_1.Args)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "buscarPorNombre", null);
__decorate([
    (0, graphql_1.Mutation)(() => cliente_entity_1.Cliente),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('updateClienteInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "updateCliente", null);
__decorate([
    (0, graphql_1.Mutation)(() => cliente_entity_1.Cliente),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('nuevoSaldo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ClientesResolver.prototype, "actualizarSaldoCliente", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientesResolver.prototype, "removeCliente", null);
exports.ClientesResolver = ClientesResolver = __decorate([
    (0, graphql_1.Resolver)(() => cliente_entity_1.Cliente),
    (0, secret_key_decorator_1.RequireSecretKey)(),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesResolver);
//# sourceMappingURL=clientes.resolver.js.map