import { apiClient } from "./client";
import type {
  AdminMessageQuery,
  Message,
  MessageCollectionResponse,
  MessageCreateRequest,
  MessageReplyRequest,
} from "../types";

export async function getMyMessages() {
  const response = await apiClient.get<MessageCollectionResponse>("/api/v1/messages");

  return response.data;
}

export async function sendMessage(data: MessageCreateRequest) {
  const response = await apiClient.post<Message>("/api/v1/messages", data);

  return response.data;
}

export async function getAdminMessages(query: AdminMessageQuery = {}) {
  const response = await apiClient.get<MessageCollectionResponse>(
    "/api/v1/admin/messages",
    {
      params: query,
    },
  );

  return response.data;
}

export async function replyToMessage(id: string, data: MessageReplyRequest) {
  const response = await apiClient.post<Message>(
    `/api/v1/admin/messages/${id}/reply`,
    data,
  );

  return response.data;
}

export async function deleteMessage(id: string) {
  const response = await apiClient.delete<Message>(`/api/v1/admin/messages/${id}`);

  return response.data;
}
