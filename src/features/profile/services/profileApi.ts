import { httpClient } from '@/shared/api/httpClient';
import type { UserProfile } from '../domain/UserProfile';
import type { ProfileMeResponseDto } from './dto/ProfileMeResponseDto';
import { profileEndpoints } from './profileEndpoints';
import { mapProfileMeResponse } from './profileMapper';

export async function getCurrentProfile(): Promise<UserProfile> {
  const response = await httpClient.get<ProfileMeResponseDto>(profileEndpoints.me);
  return mapProfileMeResponse(response);
}
