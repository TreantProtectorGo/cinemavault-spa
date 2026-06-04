import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClearOutlined,
  PictureOutlined,
  SearchOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Pagination,
  Popover,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFilms } from "../api/films";
import type { Film, FilmListResponse, FilmQueryParams } from "../types";

type FilmFilterFormValues = Omit<FilmQueryParams, "page" | "limit">;

const defaultQuery: Required<Pick<FilmQueryParams, "page" | "limit" | "sortBy" | "order">> &
  Pick<FilmQueryParams, "isLive"> = {
  page: 1,
  limit: 8,
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
    <Link className="film-card-link" aria-label={`Open ${film.title} detail`} to={`/films/${film.id}`}>
      <Card className="film-card" cover={<FilmPoster film={film} />}>
        <Space className="film-card-meta" orientation="vertical" size={10}>
          <Typography.Title level={3}>{film.title}</Typography.Title>
          <Space wrap size={[6, 6]}>
            {film.genre ? <Tag>{film.genre}</Tag> : null}
            {film.year ? <Tag color="blue">{film.year}</Tag> : null}
            {film.rating !== null ? <Tag color="gold">IMDb {film.rating}</Tag> : null}
          </Space>
        </Space>
      </Card>
    </Link>
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
    }),
    [],
  );

  const activeFilterCount = [
    query.genre,
    query.year,
    query.rating,
    query.isLive === false ? "archived" : undefined,
    query.sortBy && query.sortBy !== defaultQuery.sortBy ? query.sortBy : undefined,
    query.order && query.order !== defaultQuery.order ? query.order : undefined,
  ].filter(Boolean).length;

  function handleSearch(values: FilmFilterFormValues) {
    setQuery({
      ...values,
      page: 1,
      limit: defaultQuery.limit,
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

  const filterContent = (
    <div className="film-filter-popover">
      <Form.Item label="Genre" name="genre">
        <Input allowClear aria-label="Filter by genre" placeholder="Action, Drama, Sci-Fi" />
      </Form.Item>
      <Form.Item label="Year" name="year">
        <InputNumber
          aria-label="Filter by year"
          className="full-width"
          max={2100}
          min={1888}
          placeholder="2008"
        />
      </Form.Item>
      <Form.Item
        label="Minimum rating"
        name="rating"
        rules={[
          {
            validator: (_, value) =>
              value === undefined || value === null || value > 0
                ? Promise.resolve()
                : Promise.reject(new Error("Rating must be greater than 0.")),
          },
        ]}
      >
        <InputNumber
          aria-label="Filter by minimum rating"
          className="full-width"
          max={10}
          min={0.1}
          placeholder="7.5"
          step={0.1}
        />
      </Form.Item>
      <Form.Item label="Status" name="isLive">
        <Select
          aria-label="Filter by status"
          options={[
            { label: "Live", value: true },
            { label: "Archived", value: false },
          ]}
        />
      </Form.Item>
      <Form.Item label="Sort by" name="sortBy">
        <Select
          aria-label="Sort films by"
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
          aria-label="Sort order"
          options={[
            { label: "Descending", value: "desc" },
            { label: "Ascending", value: "asc" },
          ]}
        />
      </Form.Item>
      <Button block htmlType="submit" type="primary">
        Apply filters
      </Button>
    </div>
  );

  return (
    <section className="page-stack">
      <Card className="catalog-toolbar-card">
        <Form
          form={form}
          initialValues={initialFormValues}
          layout="horizontal"
          onFinish={handleSearch}
        >
          <div className="catalog-toolbar">
            <Form.Item className="catalog-search" name="title">
              <Input
                allowClear
                aria-label="Search by title"
                placeholder="Search films by title"
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <div className="catalog-toolbar-actions">
              <Popover
                content={filterContent}
                placement="bottomRight"
                trigger="click"
              >
                <Badge count={activeFilterCount} size="small">
                  <Button
                    aria-label="Open filters"
                    icon={<SlidersOutlined />}
                    title="Filters"
                  />
                </Badge>
              </Popover>
              <Button
                aria-label="Reset filters"
                icon={<ClearOutlined />}
                title="Reset filters"
                onClick={handleReset}
              />
            </div>
            {filmsResponse ? (
              <div className="catalog-summary">
                <strong>{filmsResponse.pagination.total} films</strong>
                <span>
                  Page {filmsResponse.pagination.page} of{" "}
                  {filmsResponse.pagination.totalPages}
                </span>
              </div>
            ) : null}
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
          <div className="film-grid">
            {filmsResponse.data.map((film) => (
              <FilmCard film={film} key={film.id} />
            ))}
          </div>

          <Pagination
            align="center"
            current={filmsResponse.pagination.page}
            pageSize={filmsResponse.pagination.limit}
            showSizeChanger={false}
            total={filmsResponse.pagination.total}
            onChange={handlePageChange}
          />
        </>
      ) : null}
    </section>
  );
}
