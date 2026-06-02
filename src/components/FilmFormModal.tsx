import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Switch } from "antd";
import type { Film, FilmCreateRequest, FilmUpdateRequest } from "../types";

type FilmFormValues = FilmCreateRequest;

type FilmFormModalProps = {
  film: Film | null;
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: FilmCreateRequest | FilmUpdateRequest) => Promise<void>;
};

function filmToFormValues(film: Film): FilmFormValues {
  return {
    title: film.title,
    genre: film.genre ?? undefined,
    year: film.year ?? undefined,
    rating: film.rating ?? undefined,
    director: film.director ?? undefined,
    cast: film.cast ?? undefined,
    plot: film.plot ?? undefined,
    posterUrl: film.posterUrl ?? undefined,
    runtime: film.runtime ?? undefined,
    language: film.language ?? undefined,
    country: film.country ?? undefined,
    imdbId: film.imdbId ?? undefined,
    isLive: film.isLive,
  };
}

function cleanFilmValues(values: FilmFormValues) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== ""),
  ) as FilmCreateRequest;
}

export function FilmFormModal({
  film,
  onCancel,
  onSubmit,
  open,
  submitting,
}: FilmFormModalProps) {
  const [form] = Form.useForm<FilmFormValues>();
  const isEditMode = Boolean(film);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (film) {
      form.setFieldsValue(filmToFormValues(film));
      return;
    }

    form.setFieldsValue({ isLive: true });
  }, [film, form, open]);

  async function handleFinish(values: FilmFormValues) {
    await onSubmit(cleanFilmValues(values));
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title={isEditMode ? "Edit film" : "Create film"}
      width={760}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <div className="admin-form-grid">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Film title is required." }]}
          >
            <Input placeholder="Inception" />
          </Form.Item>
          <Form.Item label="Genre" name="genre">
            <Input placeholder="Sci-Fi" />
          </Form.Item>
          <Form.Item label="Year" name="year">
            <InputNumber className="full-width" max={2100} min={1888} />
          </Form.Item>
          <Form.Item label="Rating" name="rating">
            <InputNumber className="full-width" max={10} min={0} step={0.1} />
          </Form.Item>
          <Form.Item label="Runtime" name="runtime">
            <InputNumber className="full-width" min={1} />
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Input placeholder="English" />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input placeholder="USA" />
          </Form.Item>
          <Form.Item label="IMDb ID" name="imdbId">
            <Input placeholder="tt1375666" />
          </Form.Item>
        </div>

        <Form.Item label="Director" name="director">
          <Input placeholder="Christopher Nolan" />
        </Form.Item>
        <Form.Item label="Cast" name="cast">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item label="Plot" name="plot">
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
        <Form.Item
          label="Poster URL"
          name="posterUrl"
          rules={[{ type: "url", message: "Enter a valid poster URL." }]}
        >
          <Input placeholder="https://example.com/poster.jpg" />
        </Form.Item>
        <Form.Item label="Live listing" name="isLive" valuePropName="checked">
          <Switch checkedChildren="Live" unCheckedChildren="Archived" />
        </Form.Item>

        <div className="modal-actions">
          <Button onClick={onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            {isEditMode ? "Save changes" : "Create film"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
