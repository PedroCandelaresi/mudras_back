import { IsString, IsOptional } from 'class-validator';

export class RefreshDto {
  @IsOptional()
  @IsString()
  refreshToken?: string; // token opaco devuelto en el login o desde cookies
}
