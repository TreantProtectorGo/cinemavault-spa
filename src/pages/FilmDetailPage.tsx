import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  LoginOutlined,
  MessageOutlined,
  PictureOutlined,
  PlaySquareOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Image,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFilmById } from "../api/films";
import { sendMessage } from "../api/messages";
import {
  addFavourite,
  addWatchlistItem,
  getFavourites,
  getWatched,
  getWatchlist,
  markWatched,
  removeFavourite,
  removeWatched,
  removeWatchlistItem,
} from "../api/tracking";
import { SendMessageModal } from "../components/SendMessageModal";
import { WatchedModal } from "../components/WatchedModal";
import { useAuth } from "../hooks/useAuth";
import type {
  Favourite,
  Film,
  MessageCreateRequest,
  WatchedCreateRequest,
  WatchedRecord,
  WatchlistItem,
} from "../types";

function DetailPoster({ film }: { film: Film }) {
  if (!film.posterUrl) {
    return (
      <div className="detail-poster detail-poster-empty">
        <PictureOutlined />
        <span>{film.title}</span>
      </div>
    );
  }

  return (
    <Image
      alt={`${film.title} poster`}
      className="detail-poster"
      fallback=""
      preview={false}
      src={film.posterUrl}
    />
  );
}

function metadataItems(film: Film) {
  return [
    {
      key: "director",
      label: "Director",
      children: film.director || "Not listed",
    },
    {
      key: "cast",
      label: "Cast",
      children: film.cast || "Not listed",
    },
    {
      key: "runtime",
      label: "Runtime",
      children: film.runtime ? `${film.runtime} minutes` : "Not listed",
    },
    {
      key: "language",
      label: "Language",
      children: film.language || "Not listed",
    },
    {
      key: "country",
      label: "Country",
      children: film.country || "Not listed",
    },
    {
      key: "imdbId",
      label: "IMDb ID",
      children: film.imdbId || "Not listed",
    },
  ];
}

export function FilmDetailPage() {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { isAuthenticated } = useAuth();
  const [film, setFilm] = useState<Film | null>(null);
  const [favourite, setFavourite] = useState<Favourite | null>(null);
  const [watchlistItem, setWatchlistItem] = useState<WatchlistItem | null>(null);
  const [watchedRecord, setWatchedRecord] = useState<WatchedRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isTrackingSubmitting, setIsTrackingSubmitting] = useState(false);
  const [isMessageSubmitting, setIsMessageSubmitting] = useState(false);
  const [isWatchedModalOpen, setIsWatchedModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFilm() {
      if (!id) {
        setErrorMessage("Film id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await getFilmById(id);

        if (isMounted) {
          setFilm(result);
        }
      } catch (error) {
        if (isMounted) {
          setFilm(null);
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFilm();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadTrackingState() {
      if (!id || !isAuthenticated) {
        setFavourite(null);
        setWatchlistItem(null);
        setWatchedRecord(null);
        return;
      }

      setIsTrackingLoading(true);

      try {
        const [favourites, watchlist, watched] = await Promise.all([
          getFavourites(),
          getWatchlist(),
          getWatched(),
        ]);

        if (isMounted) {
          setFavourite(favourites.data.find((record) => record.filmId === id) ?? null);
          setWatchlistItem(watchlist.data.find((record) => record.filmId === id) ?? null);
          setWatchedRecord(watched.data.find((record) => record.filmId === id) ?? null);
        }
      } catch (error) {
        if (isMounted) {
          messageApi.error(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsTrackingLoading(false);
        }
      }
    }

    void loadTrackingState();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, messageApi]);

  async function handleFavouriteToggle() {
    if (!id) {
      return;
    }

    setIsTrackingSubmitting(true);

    try {
      if (favourite) {
        await removeFavourite(id);
        setFavourite(null);
        messageApi.success("Removed from favourites.");
      } else {
        const result = await addFavourite(id);
        setFavourite(result);
        messageApi.success("Added to favourites.");
      }
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsTrackingSubmitting(false);
    }
  }

  async function handleWatchlistToggle() {
    if (!id) {
      return;
    }

    setIsTrackingSubmitting(true);

    try {
      if (watchlistItem) {
        await removeWatchlistItem(id);
        setWatchlistItem(null);
        messageApi.success("Removed from watchlist.");
      } else {
        const result = await addWatchlistItem(id);
        setWatchlistItem(result);
        messageApi.success("Added to watchlist.");
      }
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsTrackingSubmitting(false);
    }
  }

  async function handleWatchedSubmit(values: WatchedCreateRequest) {
    if (!id) {
      return;
    }

    setIsTrackingSubmitting(true);

    try {
      const result = await markWatched(id, values);
      setWatchedRecord(result);
      setIsWatchedModalOpen(false);
      messageApi.success(watchedRecord ? "Watched record updated." : "Marked as watched.");
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsTrackingSubmitting(false);
    }
  }

  async function handleRemoveWatched() {
    if (!id) {
      return;
    }

    setIsTrackingSubmitting(true);

    try {
      await removeWatched(id);
      setWatchedRecord(null);
      messageApi.success("Watched record removed.");
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsTrackingSubmitting(false);
    }
  }

  async function handleSendMessage(values: MessageCreateRequest) {
    setIsMessageSubmitting(true);

    try {
      await sendMessage(values);
      setIsMessageModalOpen(false);
      messageApi.success("Message sent to admin.");
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsMessageSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="page-stack">
        <Skeleton active paragraph={{ rows: 10 }} />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <Result
        status={errorMessage.toLowerCase().includes("not found") ? "404" : "error"}
        title={errorMessage.toLowerCase().includes("not found") ? "Film not found" : "Could not load film"}
        subTitle={errorMessage}
        extra={
          <Link to="/films">
            <Button icon={<ArrowLeftOutlined />} type="primary">
              Back to films
            </Button>
          </Link>
        }
      />
    );
  }

  if (!film) {
    return (
      <Result
        status="404"
        title="Film not found"
        extra={
          <Link to="/films">
            <Button icon={<ArrowLeftOutlined />} type="primary">
              Back to films
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="page-stack">
      {contextHolder}
      <Link to="/films">
        <Button icon={<ArrowLeftOutlined />}>Back to films</Button>
      </Link>

      <Card className="film-detail-card">
        <div className="film-detail-layout">
          <DetailPoster film={film} />

          <div className="film-detail-copy">
            <Space orientation="vertical" size={16}>
              <div className="page-heading">
                <Typography.Title level={1}>{film.title}</Typography.Title>
                <Space wrap size={[8, 8]}>
                  {film.genre ? <Tag>{film.genre}</Tag> : null}
                  {film.year ? <Tag color="blue">{film.year}</Tag> : null}
                  {film.rating !== null ? <Tag color="gold">IMDb {film.rating}</Tag> : null}
                  <Tag color={film.isLive ? "green" : "default"}>
                    {film.isLive ? "Live" : "Archived"}
                  </Tag>
                </Space>
              </div>

              {film.plot ? (
                <Typography.Paragraph className="film-plot">
                  {film.plot}
                </Typography.Paragraph>
              ) : (
                <Alert
                  showIcon
                  type="info"
                  title="Plot summary is not available for this film yet."
                />
              )}

              <Descriptions
                bordered
                column={1}
                items={metadataItems(film)}
                size="middle"
              />

              {isAuthenticated ? (
                <Space wrap>
                  <Button
                    icon={<HeartOutlined />}
                    loading={isTrackingLoading || isTrackingSubmitting}
                    type={favourite ? "primary" : "default"}
                    onClick={() => void handleFavouriteToggle()}
                  >
                    {favourite ? "Remove favourite" : "Add favourite"}
                  </Button>
                  <Button
                    icon={<PlaySquareOutlined />}
                    loading={isTrackingLoading || isTrackingSubmitting}
                    type={watchlistItem ? "primary" : "default"}
                    onClick={() => void handleWatchlistToggle()}
                  >
                    {watchlistItem ? "Remove watchlist" : "Add watchlist"}
                  </Button>
                  <Button
                    icon={<CheckCircleOutlined />}
                    loading={isTrackingLoading || isTrackingSubmitting}
                    type={watchedRecord ? "primary" : "default"}
                    onClick={() => setIsWatchedModalOpen(true)}
                  >
                    {watchedRecord ? "Update watched" : "Mark watched"}
                  </Button>
                  {watchedRecord ? (
                    <Button
                      danger
                      loading={isTrackingSubmitting}
                      onClick={() => void handleRemoveWatched()}
                    >
                      Remove watched
                    </Button>
                  ) : null}
                  <Button
                    icon={<MessageOutlined />}
                    loading={isMessageSubmitting}
                    onClick={() => setIsMessageModalOpen(true)}
                  >
                    Message admin about this film
                  </Button>
                </Space>
              ) : (
                <Alert
                  showIcon
                  type="info"
                  title="Login required for tracking"
                  description="Sign in to add favourites, build your watchlist, or mark films as watched."
                  action={
                    <Link to="/login">
                      <Button icon={<LoginOutlined />} size="small" type="primary">
                        Login
                      </Button>
                    </Link>
                  }
                />
              )}
            </Space>
          </div>
        </div>
      </Card>

      <WatchedModal
        open={isWatchedModalOpen}
        submitting={isTrackingSubmitting}
        onCancel={() => setIsWatchedModalOpen(false)}
        onSubmit={handleWatchedSubmit}
      />

      <SendMessageModal
        film={film}
        open={isMessageModalOpen}
        submitting={isMessageSubmitting}
        onCancel={() => setIsMessageModalOpen(false)}
        onSubmit={handleSendMessage}
      />
    </section>
  );
}
