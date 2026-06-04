import { Link } from "react-router-dom";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Image,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import type { Film } from "../types";

export type TrackingFilmRecord = {
  id: string;
  filmId: string;
  film: Film;
  rating?: number | null;
  notes?: string | null;
  watchedAt?: string;
  createdAt?: string;
};

type TrackingFilmListProps<TRecord extends TrackingFilmRecord> = {
  records: TRecord[];
  loading: boolean;
  emptyText: string;
  removeLabel: string;
  onRemove: (record: TRecord) => void;
};

function TrackingPoster({ film }: { film: Film }) {
  if (!film.posterUrl) {
    return (
      <div className="tracking-poster tracking-poster-empty">
        <PictureOutlined />
        <span>{film.title}</span>
      </div>
    );
  }

  return (
    <Image
      alt={`${film.title} poster`}
      className="tracking-poster"
      fallback=""
      preview={false}
      src={film.posterUrl}
    />
  );
}

export function TrackingFilmList<TRecord extends TrackingFilmRecord>({
  emptyText,
  loading,
  onRemove,
  records,
  removeLabel,
}: TrackingFilmListProps<TRecord>) {
  if (loading) {
    return (
      <div className="tracking-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="tracking-grid">
      {records.map((record) => (
        <Card className="tracking-card" key={record.id}>
          <div className="tracking-card-layout">
            <TrackingPoster film={record.film} />
            <div className="tracking-card-copy">
              <Space orientation="vertical" size={10}>
                <div>
                  <Typography.Title level={3}>{record.film.title}</Typography.Title>
                  <Space wrap size={[6, 6]}>
                    {record.film.genre ? <Tag>{record.film.genre}</Tag> : null}
                    {record.film.year ? <Tag color="blue">{record.film.year}</Tag> : null}
                    {record.rating ? <Tag color="gold">Your rating {record.rating}</Tag> : null}
                  </Space>
                </div>

                <Typography.Paragraph ellipsis={{ rows: 2 }} type="secondary">
                  {record.notes || record.film.plot || "No notes yet."}
                </Typography.Paragraph>

                <Space wrap>
                  <Link to={`/films/${record.filmId}`}>
                    <Button size="small">View film</Button>
                  </Link>
                  <Popconfirm
                    title={removeLabel}
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onRemove(record)}
                  >
                    <Button danger icon={<DeleteOutlined />} size="small">
                      Remove
                    </Button>
                  </Popconfirm>
                </Space>
              </Space>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
