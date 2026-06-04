import { apiClient } from "./client";
import type {
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types";

export async function loginRequest(input: LoginRequest) {
  const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", input);

  return response.data;
}

export async function registerRequest(input: RegisterRequest) {
  const response = await apiClient.post<LoginResponse>(
    "/api/v1/auth/register",
    input,
  );

  return response.data;
}

export async function googleLoginRequest(input: GoogleLoginRequest) {
  const response = await apiClient.post<LoginResponse>("/api/v1/auth/google", input);

  return response.data;
}

export async function adminPingRequest() {
  const response = await apiClient.get<{ status: string; role: string }>(
    "/api/v1/admin/ping",
  );

  return response.data;
}
