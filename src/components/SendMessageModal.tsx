import { useEffect } from "react";
import { Button, Form, Input, Modal, Select, Typography } from "antd";
import type { Film, MessageCreateRequest } from "../types";

type SendMessageModalProps = {
  film?: Film;
  filmOptions?: Film[];
  filmsLoading?: boolean;
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: MessageCreateRequest) => Promise<void>;
};

type SendMessageFormValues = MessageCreateRequest;

export function SendMessageModal({
  film,
  filmOptions = [],
  filmsLoading = false,
  onCancel,
  onSubmit,
  open,
  submitting,
}: SendMessageModalProps) {
  const [form] = Form.useForm<SendMessageFormValues>();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (film) {
      form.setFieldsValue({
        filmId: film.id,
        subject: `Question about ${film.title}`,
      });
    }
  }, [film, form, open]);

  function handleFilmChange(filmId: string) {
    const selectedFilm = filmOptions.find((option) => option.id === filmId);
    const currentSubject = form.getFieldValue("subject");

    if (selectedFilm && !currentSubject) {
      form.setFieldValue("subject", `Question about ${selectedFilm.title}`);
    }
  }

  async function handleFinish(values: SendMessageFormValues) {
    await onSubmit(values);
    form.resetFields();
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title={film ? `Message admin about ${film.title}` : "Send message to admin"}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        {film ? (
          <>
            <Form.Item hidden name="filmId">
              <Input />
            </Form.Item>
            <Form.Item label="Film">
              <Typography.Text strong>{film.title}</Typography.Text>
            </Form.Item>
          </>
        ) : (
          <Form.Item
            label="Film"
            name="filmId"
            rules={[{ required: true, message: "Choose a film." }]}
          >
            <Select
              showSearch
              loading={filmsLoading}
              optionFilterProp="label"
              options={filmOptions.map((option) => ({
                label: option.year ? `${option.title} (${option.year})` : option.title,
                value: option.id,
              }))}
              placeholder="Choose a film"
              onChange={handleFilmChange}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Subject"
          name="subject"
          rules={[
            { required: true, message: "Subject is required." },
            { max: 160, message: "Subject is too long." },
          ]}
        >
          <Input placeholder="Screening question" />
        </Form.Item>
        <Form.Item
          label="Message"
          name="body"
          rules={[
            { required: true, message: "Message body is required." },
            { max: 5000, message: "Message is too long." },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
        </Form.Item>

        <div className="modal-actions">
          <Button onClick={onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            Send message
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
