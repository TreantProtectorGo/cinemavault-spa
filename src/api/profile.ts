import { apiClient } from "./client";
import type { UserPublic } from "../types";

export async function getCurrentUser() {
  const response = await apiClient.get<UserPublic>("/api/v1/me");

  return response.data;
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append("profilePhoto", file);

  const response = await apiClient.post<UserPublic>(
    "/api/v1/me/profile-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
