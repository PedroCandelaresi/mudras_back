import { IsOptional, IsString, MinLength, IsUUID } from 'class-validator';

export class ActualizarPermisoDto {
  @IsUUID()
  id!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  resource?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  action?: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
