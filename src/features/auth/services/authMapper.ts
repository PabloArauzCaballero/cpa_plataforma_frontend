import type { AuthSession } from '../domain/AuthSession';
import type { LoginResponseDto } from './dto/LoginResponseDto';

export function mapLoginResponse(dto: LoginResponseDto, fallbackEmail: string): AuthSession {
  const sessionToken = dto.data?.sessionToken ?? dto.sessionToken ?? dto.token;

  if (!sessionToken) {
    throw new Error('La respuesta de login no incluye data.sessionToken.');
  }

  return {
    sessionToken,
    email: dto.data?.user?.email ?? dto.user?.email ?? fallbackEmail,
  };
}
