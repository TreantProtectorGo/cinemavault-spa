import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClearOutlined,
  FilterOutlined,
  PictureOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Pagination,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFilms } from "../api/films";
import type { Film, FilmListResponse, FilmQueryParams } from "../types";

type FilmFilterFormValues = Omit<FilmQueryParams, "page" | "limit"> & {
  limit: number;
};

const defaultQuery: Required<Pick<FilmQueryParams, "page" | "limit" | "sortBy" | "order">> &
  Pick<FilmQueryParams, "isLive"> = {
  page: 1,
  limit: 9,
  sortBy: "createdAt",
  order: "desc",
  isLive: true,
};

function FilmPoster({ film }: { film: Film }) {
  if (!film.posterUrl) {
    return (
      <div className="film-poster film-poster-empty">
        <PictureOutlined />
        <span>{film.title}</span>
      </div>
    );
  }

  return (
    <Image
      alt={`${film.title} poster`}
      className="film-poster"
      fallback=""
      preview={false}
      src={film.posterUrl}
    />
  );
}

function FilmCard({ film }: { film: Film }) {
  return (
    <Card
      className="film-card"
      cover={<FilmPoster film={film} />}
      actions={[
        <Link key="detail" to={`/films/${film.id}`}>
          View detail
        </Link>,
      ]}
    >
      <Space className="film-card-meta" orientation="vertical" size={10}>
        <div>
          <Typography.Title level={3}>{film.title}</Typography.Title>
          <Space wrap size={[6, 6]}>
            {film.genre ? <Tag>{film.genre}</Tag> : null}
            {film.year ? <Tag color="blue">{film.year}</Tag> : null}
            {film.rating !== null ? <Tag color="gold">IMDb {film.rating}</Tag> : null}
          </Space>
        </div>

        <Typography.Paragraph ellipsis={{ rows: 2 }} type="secondary">
          {film.plot || film.cast || film.director || "Film metadata pending."}
        </Typography.Paragraph>

        <Typography.Text type="secondary">
          {film.director ? `Director: ${film.director}` : "Director not listed"}
        </Typography.Text>
      </Space>
    </Card>
  );
}

export function FilmsPage() {
  const [form] = Form.useForm<FilmFilterFormValues>();
  const [query, setQuery] = useState<FilmQueryParams>(defaultQuery);
  const [filmsResponse, setFilmsResponse] = useState<FilmListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFilms() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await getFilms(query);

        if (isMounted) {
          setFilmsResponse(result);
        }
      } catch (error) {
        if (isMounted) {
          setFilmsResponse(null);
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFilms();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const initialFormValues = useMemo<FilmFilterFormValues>(
    () => ({
      title: undefined,
      genre: undefined,
      year: undefined,
      rating: undefined,
      isLive: true,
      sortBy: "createdAt",
      order: "desc",
      limit: 9,
    }),
    [],
  );

  function handleSearch(values: FilmFilterFormValues) {
    setQuery({
      ...values,
      page: 1,
      limit: values.limit ?? defaultQuery.limit,
    });
  }

  function handleReset() {
    form.resetFields();
    setQuery(defaultQuery);
  }

  function handlePageChange(page: number, limit: number) {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page,
      limit,
    }));
  }

  return (
    <section className="page-stack">
      <div className="page-heading films-heading">
        <div className="films-heading-copy">
          <h1>Films</h1>
          <p>Search and browse the current CinemaVault film catalogue.</p>
        </div>
      </div>

      <Card className="filter-card">
        <Form
          form={form}
          initialValues={initialFormValues}
          layout="vertical"
          onFinish={handleSearch}
        >
          <div className="film-filter-grid">
            <Form.Item label="Title" name="title">
              <Input allowClear placeholder="Search by title" prefix={<SearchOutlined />} />
            </Form.Item>
            <Form.Item label="Genre" name="genre">
              <Input allowClear placeholder="Action, Sci-Fi, Drama" />
            </Form.Item>
            <Form.Item label="Year" name="year">
              <InputNumber className="full-width" max={2100} min={1888} placeholder="2008" />
            </Form.Item>
            <Form.Item label="Rating" name="rating">
              <InputNumber
                className="full-width"
                max={10}
                min={0}
                placeholder="8.8"
                step={0.1}
              />
            </Form.Item>
            <Form.Item label="Status" name="isLive">
              <Select
                options={[
                  { label: "Live films", value: true },
                  { label: "Archived films", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="Sort by" name="sortBy">
              <Select
                options={[
                  { label: "Recently updated", value: "updatedAt" },
                  { label: "Recently added", value: "createdAt" },
                  { label: "Title", value: "title" },
                  { label: "Year", value: "year" },
                  { label: "Rating", value: "rating" },
                  { label: "Genre", value: "genre" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Order" name="order">
              <Select
                options={[
                  { label: "Descending", value: "desc" },
                  { label: "Ascending", value: "asc" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Per page" name="limit">
              <Select
                options={[
                  { label: "6", value: 6 },
                  { label: "9", value: 9 },
                  { label: "12", value: 12 },
                ]}
              />
            </Form.Item>
          </div>

          <div className="filter-actions">
            <Button htmlType="submit" icon={<FilterOutlined />} type="primary">
              Search films
            </Button>
            <Button icon={<ClearOutlined />} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form>
      </Card>

      {errorMessage ? (
        <Alert
          showIcon
          type="error"
          title="Could not load films"
          description={errorMessage}
        />
      ) : null}

      {isLoading ? (
        <div className="film-grid">
          {Array.from({ length: query.limit ?? defaultQuery.limit }).map((_, index) => (
            <Card className="film-card" key={index}>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && !errorMessage && filmsResponse?.data.length === 0 ? (
        <Empty
          description="No films match the current filters."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : null}

      {!isLoading && !errorMessage && filmsResponse?.data.length ? (
        <>
          <div className="film-results-bar">
            <Typography.Text strong>
              {filmsResponse.pagination.total} films
            </Typography.Text>
            <Typography.Text type="secondary">
              Page {filmsResponse.pagination.page} of {filmsResponse.pagination.totalPages}
            </Typography.Text>
          </div>

          <div className="film-grid">
            {filmsResponse.data.map((film) => (
              <FilmCard film={film} key={film.id} />
            ))}
          </div>

          <Pagination
            align="center"
            current={filmsResponse.pagination.page}
            pageSize={filmsResponse.pagination.limit}
            pageSizeOptions={[6, 9, 12]}
            showSizeChanger
            total={filmsResponse.pagination.total}
            onChange={handlePageChange}
          />
        </>
      ) : null}
    </section>
  );
}
