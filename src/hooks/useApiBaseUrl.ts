import { env } from "../utils/env";

export function useApiBaseUrl() {
  return env.apiBaseUrl;
}
