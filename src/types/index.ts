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

export type HateoasLinks = Record<string, string>;

export type Film = {
  id: string;
  title: string;
  genre: string | null;
  year: number | null;
  rating: number | null;
  director: string | null;
  cast: string | null;
  plot: string | null;
  posterUrl: string | null;
  runtime: number | null;
  language: string | null;
  country: string | null;
  imdbId: string | null;
  omdbMetadataJson: string | null;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
  links: HateoasLinks;
};

export type FilmQueryParams = {
  title?: string;
  genre?: string;
  year?: number;
  rating?: number;
  isLive?: boolean;
  sortBy?: "title" | "genre" | "year" | "rating" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type FilmListResponse = {
  data: Film[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  links: HateoasLinks;
};

export type FilmCreateRequest = {
  title: string;
  genre?: string;
  year?: number;
  rating?: number;
  director?: string;
  cast?: string;
  plot?: string;
  posterUrl?: string;
  runtime?: number;
  language?: string;
  country?: string;
  imdbId?: string;
  isLive?: boolean;
};

export type FilmUpdateRequest = Partial<FilmCreateRequest>;

export type OmdbImportRequest = {
  imdbId?: string;
  title?: string;
};

export type OmdbImportResponse = Film;
