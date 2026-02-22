// Типы для сервиса аутентификации

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    preferredLang: string;
  };
  session: Session;
}

export interface TwoFactorRequiredResult {
  requiresTwoFactor: true;
  userId: string;
}

export interface TwoFactorVerificationResult {
  success: true;
  session: Session;
}
