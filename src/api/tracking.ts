import { apiClient } from "./client";
import type {
  Favourite,
  TrackingCollectionResponse,
  WatchedCreateRequest,
  WatchedRecord,
  WatchlistItem,
} from "../types";

type TrackingRemoveResponse = {
  status: string;
  filmId: string;
  links: Record<string, string>;
};

export async function getFavourites() {
  const response =
    await apiClient.get<TrackingCollectionResponse<Favourite>>("/api/v1/favourites");

  return response.data;
}

export async function addFavourite(filmId: string) {
  const response = await apiClient.post<Favourite>(
    `/api/v1/favourites/${filmId}`,
  );

  return response.data;
}

export async function removeFavourite(filmId: string) {
  const response = await apiClient.delete<TrackingRemoveResponse>(
    `/api/v1/favourites/${filmId}`,
  );

  return response.data;
}

export async function getWatchlist() {
  const response =
    await apiClient.get<TrackingCollectionResponse<WatchlistItem>>("/api/v1/watchlist");

  return response.data;
}

export async function addWatchlistItem(filmId: string) {
  const response = await apiClient.post<WatchlistItem>(
    `/api/v1/watchlist/${filmId}`,
  );

  return response.data;
}

export async function removeWatchlistItem(filmId: string) {
  const response = await apiClient.delete<TrackingRemoveResponse>(
    `/api/v1/watchlist/${filmId}`,
  );

  return response.data;
}

export async function getWatched() {
  const response =
    await apiClient.get<TrackingCollectionResponse<WatchedRecord>>("/api/v1/watched");

  return response.data;
}

export async function markWatched(filmId: string, data: WatchedCreateRequest) {
  const response = await apiClient.post<WatchedRecord>(
    `/api/v1/watched/${filmId}`,
    data,
  );

  return response.data;
}

export async function removeWatched(filmId: string) {
  const response = await apiClient.delete<TrackingRemoveResponse>(
    `/api/v1/watched/${filmId}`,
  );

  return response.data;
}
