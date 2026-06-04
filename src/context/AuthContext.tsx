import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { googleLoginRequest, loginRequest, registerRequest } from "../api/auth";
import { setBearerToken } from "../api/client";
import { getCurrentUser } from "../api/profile";
import { AuthContext } from "./auth-context-value";
import type {
  AuthContextValue,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  UserPublic,
} from "../types";

const AUTH_STORAGE_KEY = "cinemavault.auth";

type StoredAuthState = {
  token: string;
  user: UserPublic;
};

function readStoredAuth() {
  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredAuthState;

    if (parsed.token && parsed.user) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
}

function persistAuth(state: StoredAuthState | null) {
  if (!state) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setBearerToken(null);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  setBearerToken(state.token);
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = readStoredAuth();

    if (storedAuth) {
      setUser(storedAuth.user);
      setToken(storedAuth.token);
      setBearerToken(storedAuth.token);
    }
  }, []);

  const applyAuthResponse = useCallback((response: StoredAuthState) => {
    setUser(response.user);
    setToken(response.token);
    persistAuth(response);
  }, []);

  const refreshUser = useCallback(async () => {
    const nextUser = await getCurrentUser();

    setUser(nextUser);
    setToken((currentToken) => {
      if (currentToken) {
        persistAuth({ token: currentToken, user: nextUser });
      }

      return currentToken;
    });

    return nextUser;
  }, []);

  const login = useCallback(
    async (input: LoginRequest) => {
      const response = await loginRequest(input);
      applyAuthResponse(response);

      return response;
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (input: RegisterRequest) => {
      const response = await registerRequest(input);
      applyAuthResponse(response);

      return response;
    },
    [applyAuthResponse],
  );

  const loginWithGoogle = useCallback(
    async (input: GoogleLoginRequest) => {
      const response = await googleLoginRequest(input);
      applyAuthResponse(response);

      return response;
    },
    [applyAuthResponse],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    persistAuth(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      register,
      loginWithGoogle,
      refreshUser,
      logout,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "ADMIN",
    }),
    [login, loginWithGoogle, logout, refreshUser, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
