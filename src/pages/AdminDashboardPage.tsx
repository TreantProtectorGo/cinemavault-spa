import { useCallback, useEffect, useState } from "react";
import {
  CloudDownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Segmented, Space, Statistic, message } from "antd";
import {
  createFilm,
  deleteFilm,
  getFilms,
  importFilmFromOmdb,
  updateFilm,
} from "../api/films";
import { getApiErrorMessage } from "../api/client";
import { AdminFilmTable } from "../components/AdminFilmTable";
import { FilmFormModal } from "../components/FilmFormModal";
import { OmdbImportModal } from "../components/OmdbImportModal";
import type {
  Film,
  FilmCreateRequest,
  FilmListResponse,
  FilmUpdateRequest,
  OmdbImportRequest,
} from "../types";

type ListingMode = "live" | "archived";

export function AdminDashboardPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [listingMode, setListingMode] = useState<ListingMode>("live");
  const [filmsResponse, setFilmsResponse] = useState<FilmListResponse | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
  const [isOmdbModalOpen, setIsOmdbModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFilms = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getFilms({
        isLive: listingMode === "live",
        limit: 100,
        order: "desc",
        page: 1,
        sortBy: "updatedAt",
      });

      setFilmsResponse(result);
    } catch (error) {
      setFilmsResponse(null);
      setErrorMessage(`${getApiErrorMessage(error)} Please login again if your admin session expired.`);
    } finally {
      setIsLoading(false);
    }
  }, [listingMode]);

  useEffect(() => {
    void loadFilms();
  }, [loadFilms]);

  function openCreateModal() {
    setSelectedFilm(null);
    setIsFilmModalOpen(true);
  }

  function openEditModal(film: Film) {
    setSelectedFilm(film);
    setIsFilmModalOpen(true);
  }

  async function handleFilmSubmit(values: FilmCreateRequest | FilmUpdateRequest) {
    setIsSubmitting(true);

    try {
      if (selectedFilm) {
        await updateFilm(selectedFilm.id, values);
        messageApi.success("Film updated.");
      } else {
        await createFilm(values as FilmCreateRequest);
        messageApi.success("Film created.");
      }

      setIsFilmModalOpen(false);
      setSelectedFilm(null);
      await loadFilms();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(film: Film) {
    setIsSubmitting(true);

    try {
      await deleteFilm(film.id);
      messageApi.success("Film archived.");
      await loadFilms();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOmdbImport(values: OmdbImportRequest) {
    setIsSubmitting(true);

    try {
      const film = await importFilmFromOmdb(values);
      messageApi.success(`Imported ${film.title}.`);
      setIsOmdbModalOpen(false);
      setListingMode("live");
      await loadFilms();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const films = filmsResponse?.data ?? [];

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading admin-heading">
        <div>
          <h1>Admin dashboard</h1>
          <p>Manage CinemaVault film records and import metadata from OMDB.</p>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => void loadFilms()}>
            Refresh
          </Button>
          <Button icon={<CloudDownloadOutlined />} onClick={() => setIsOmdbModalOpen(true)}>
            Import OMDB
          </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={openCreateModal}>
            Create film
          </Button>
        </Space>
      </div>

      <div className="admin-stat-grid">
        <Card>
          <Statistic title="Current view" value={listingMode === "live" ? "Live" : "Archived"} />
        </Card>
        <Card>
          <Statistic title="Films loaded" value={films.length} />
        </Card>
        <Card>
          <Statistic
            prefix={<VideoCameraAddOutlined />}
            title="Management"
            value="CRUD"
          />
        </Card>
      </div>

      {errorMessage ? (
        <Alert showIcon type="error" title="Admin request failed" description={errorMessage} />
      ) : null}

      <Card
        className="admin-table-card"
        title="Film records"
        extra={
          <Segmented<ListingMode>
            options={[
              { label: "Live", value: "live" },
              { label: "Archived", value: "archived" },
            ]}
            value={listingMode}
            onChange={setListingMode}
          />
        }
      >
        <AdminFilmTable
          films={films}
          loading={isLoading || isSubmitting}
          onDelete={handleDelete}
          onEdit={openEditModal}
        />
      </Card>

      <FilmFormModal
        film={selectedFilm}
        open={isFilmModalOpen}
        submitting={isSubmitting}
        onCancel={() => {
          setIsFilmModalOpen(false);
          setSelectedFilm(null);
        }}
        onSubmit={handleFilmSubmit}
      />

      <OmdbImportModal
        open={isOmdbModalOpen}
        submitting={isSubmitting}
        onCancel={() => setIsOmdbModalOpen(false)}
        onSubmit={handleOmdbImport}
      />
    </section>
  );
}
