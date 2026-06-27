import type { AuthSession } from '../domain/AuthSession';
import type { LoginResponseDto } from './dto/LoginResponseDto';
import { buildStoredSessionFromLoginResponse } from '@/shared/auth/session';

export function mapLoginResponse(dto: LoginResponseDto, fallbackEmail: string): AuthSession {
  return buildStoredSessionFromLoginResponse(dto, fallbackEmail);
}
