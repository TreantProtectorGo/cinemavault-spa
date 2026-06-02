import { apiClient } from "./client";
import type {
  Film,
  FilmCreateRequest,
  FilmListResponse,
  FilmQueryParams,
  FilmUpdateRequest,
  OmdbImportRequest,
  OmdbImportResponse,
} from "../types";

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

export async function createFilm(data: FilmCreateRequest) {
  const response = await apiClient.post<Film>("/api/v1/films", data);

  return response.data;
}

export async function updateFilm(id: string, data: FilmUpdateRequest) {
  const response = await apiClient.put<Film>(`/api/v1/films/${id}`, data);

  return response.data;
}

export async function deleteFilm(id: string) {
  const response = await apiClient.delete<Film>(`/api/v1/films/${id}`);

  return response.data;
}

export async function importFilmFromOmdb(data: OmdbImportRequest) {
  const response = await apiClient.post<OmdbImportResponse>(
    "/api/v1/films/import-omdb",
    data,
  );

  return response.data;
}
