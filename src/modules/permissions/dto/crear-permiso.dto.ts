import { IsOptional, IsString, MinLength } from 'class-validator';

export class CrearPermisoDto {
  @IsString()
  @MinLength(2)
  resource!: string;

  @IsString()
  @MinLength(2)
  action!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
