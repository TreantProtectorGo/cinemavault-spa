import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoadingFallback } from "../components/PageLoadingFallback";
import { AppLayout } from "../layouts/AppLayout";
import { AdminRoute, ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() =>
  import("../pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const FilmsPage = lazy(() =>
  import("../pages/FilmsPage").then((module) => ({ default: module.FilmsPage })),
);
const FilmDetailPage = lazy(() =>
  import("../pages/FilmDetailPage").then((module) => ({
    default: module.FilmDetailPage,
  })),
);
const FavouritesPage = lazy(() =>
  import("../pages/FavouritesPage").then((module) => ({
    default: module.FavouritesPage,
  })),
);
const WatchlistPage = lazy(() =>
  import("../pages/WatchlistPage").then((module) => ({
    default: module.WatchlistPage,
  })),
);
const WatchedPage = lazy(() =>
  import("../pages/WatchedPage").then((module) => ({ default: module.WatchedPage })),
);
const MessagesPage = lazy(() =>
  import("../pages/MessagesPage").then((module) => ({ default: module.MessagesPage })),
);
const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((module) => ({ default: module.ProfilePage })),
);
const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((module) => ({ default: module.RegisterPage })),
);
const AdminDashboardPage = lazy(() =>
  import("../pages/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const AdminMessagesPage = lazy(() =>
  import("../pages/AdminMessagesPage").then((module) => ({
    default: module.AdminMessagesPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

export function AppRoutes() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoadingFallback />}>
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
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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
          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <AdminMessagesPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
