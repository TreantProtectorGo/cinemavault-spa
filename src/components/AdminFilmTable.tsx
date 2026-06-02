import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Button, Empty, Image, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Film } from "../types";

type AdminFilmTableProps = {
  films: Film[];
  loading: boolean;
  onEdit: (film: Film) => void;
  onDelete: (film: Film) => void;
};

function PosterCell({ film }: { film: Film }) {
  if (!film.posterUrl) {
    return (
      <div className="admin-poster admin-poster-empty">
        <PictureOutlined />
      </div>
    );
  }

  return (
    <Image
      alt={`${film.title} poster`}
      className="admin-poster"
      fallback=""
      preview={false}
      src={film.posterUrl}
    />
  );
}

export function AdminFilmTable({
  films,
  loading,
  onDelete,
  onEdit,
}: AdminFilmTableProps) {
  const columns: ColumnsType<Film> = [
    {
      title: "Film",
      dataIndex: "title",
      key: "title",
      render: (_, film) => (
        <Space size={12}>
          <PosterCell film={film} />
          <div className="admin-film-title">
            <Typography.Text strong>{film.title}</Typography.Text>
            <Typography.Text type="secondary">
              {film.director || "Director not listed"}
            </Typography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      responsive: ["md"],
      render: (genre: Film["genre"]) => genre || "Not listed",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 92,
      render: (year: Film["year"]) => year ?? "-",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 104,
      render: (rating: Film["rating"]) =>
        rating !== null ? <Tag color="gold">IMDb {rating}</Tag> : "-",
    },
    {
      title: "Status",
      dataIndex: "isLive",
      key: "isLive",
      width: 108,
      render: (isLive: Film["isLive"]) => (
        <Tag color={isLive ? "green" : "default"}>
          {isLive ? "Live" : "Archived"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, film) => (
        <Space wrap>
          <Link to={`/films/${film.id}`}>
            <Button icon={<EyeOutlined />} size="small">
              View
            </Button>
          </Link>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(film)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete film?"
            description="This will archive the film in the backend."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(film)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={films}
      loading={loading}
      locale={{ emptyText: <Empty description="No films found." /> }}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 920 }}
    />
  );
}
