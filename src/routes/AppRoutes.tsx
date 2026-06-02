import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { FilmDetailPage } from "../pages/FilmDetailPage";
import { FilmsPage } from "../pages/FilmsPage";
import { FavouritesPage } from "../pages/FavouritesPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RegisterPage } from "../pages/RegisterPage";
import { WatchedPage } from "../pages/WatchedPage";
import { WatchlistPage } from "../pages/WatchlistPage";
import { AdminRoute, ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/films/:id" element={<FilmDetailPage />} />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavouritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watched"
          element={
            <ProtectedRoute>
              <WatchedPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
