export interface LoginResponseDto {
  data?: {
    sessionToken?: string;
    user?: {
      email?: string;
      username?: string;
    };
  };
  sessionToken?: string;
  token?: string;
  user?: {
    email?: string;
    username?: string;
  };
}
