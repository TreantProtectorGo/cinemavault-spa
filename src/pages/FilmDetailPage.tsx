import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PictureOutlined,
  VideoCameraOutlined,
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
} from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFilmById } from "../api/films";
import type { Film } from "../types";

function DetailPoster({ film }: { film: Film }) {
  if (!film.posterUrl) {
    return (
      <div className="detail-poster detail-poster-empty">
        <PictureOutlined />
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
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      <Link to="/films">
        <Button icon={<ArrowLeftOutlined />}>Back to films</Button>
      </Link>

      <Card className="film-detail-card">
        <div className="film-detail-layout">
          <DetailPoster film={film} />

          <div className="film-detail-copy">
            <Space direction="vertical" size={16}>
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
                  message="Plot summary is not available for this film yet."
                />
              )}

              <Descriptions
                bordered
                column={1}
                items={metadataItems(film)}
                size="middle"
              />

              <Space wrap>
                <Button disabled icon={<VideoCameraOutlined />}>
                  Add to watchlist later
                </Button>
                <Button disabled>Favourite later</Button>
              </Space>
            </Space>
          </div>
        </div>
      </Card>
    </section>
  );
}
