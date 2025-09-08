import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  refreshToken!: string; // token opaco devuelto en el login
}
