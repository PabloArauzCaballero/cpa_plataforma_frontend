import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '../domain/UserProfile';
import { getCurrentProfile } from '../services/profileApi';

export function useUserProfileViewModel() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentProfile = await getCurrentProfile();
      setProfile(currentProfile);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar el perfil del usuario.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    reload: loadProfile,
  };
}
