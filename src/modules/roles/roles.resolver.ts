import { Resolver, Query, Field, ObjectType } from '@nestjs/graphql';
import { RolesService } from './roles.service';

@ObjectType()
export class RolePublic {
    @Field()
    id!: string;

    @Field()
    nombre!: string; // Aliased from name

    @Field()
    slug!: string;
}

@Resolver(() => RolePublic)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) { }

    @Query(() => [RolePublic], { name: 'roles' })
    async roles() {
        const all = await this.rolesService.listar();
        return all.map(r => ({
            id: r.id,
            nombre: r.name, // Map name to nombre
            slug: r.slug
        }));
    }
}
