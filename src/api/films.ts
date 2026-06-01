import { apiClient } from "./client";
import type { Film, FilmListResponse, FilmQueryParams } from "../types";

function removeEmptyQueryValues(query: FilmQueryParams) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

export async function getFilms(query: FilmQueryParams) {
  const response = await apiClient.get<FilmListResponse>("/api/v1/films", {
    params: removeEmptyQueryValues(query),
  });

  return response.data;
}

export async function getFilmById(id: string) {
  const response = await apiClient.get<Film>(`/api/v1/films/${id}`);

  return response.data;
}
