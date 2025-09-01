import { UseGuards } from '@nestjs/common';
import { SecretKeyGuard } from '../guards/secret-key.guard';

export const RequireSecretKey = () => UseGuards(SecretKeyGuard);
