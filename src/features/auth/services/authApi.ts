import { httpClient } from '@/shared/api/httpClient';
import type { AuthSession } from '../domain/AuthSession';
import type { LoginRequestDto } from './dto/LoginRequestDto';
import type { LoginResponseDto } from './dto/LoginResponseDto';
import { authEndpoints } from './authEndpoints';
import { mapLoginResponse } from './authMapper';

export async function login(payload: LoginRequestDto): Promise<AuthSession> {
  const response = await httpClient.post<LoginResponseDto, LoginRequestDto>(authEndpoints.login, payload);
  return mapLoginResponse(response, payload.email);
}
