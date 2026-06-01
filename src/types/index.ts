export type UserRole = "USER" | "ADMIN";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export type UserPublic = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  displayName?: string | null;
  profilePhotoUrl?: string | null;
};

export type LoginRequest = {
  emailOrUsername: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  displayName?: string;
};

export type LoginResponse = {
  user: UserPublic;
  token: string;
};

export type AuthContextValue = {
  user: UserPublic | null;
  token: string | null;
  login: (input: LoginRequest) => Promise<LoginResponse>;
  register: (input: RegisterRequest) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};
