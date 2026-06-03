import { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import type { Film, MessageCreateRequest } from "../types";

type SendMessageModalProps = {
  film?: Film;
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: MessageCreateRequest) => Promise<void>;
};

type SendMessageFormValues = MessageCreateRequest;

export function SendMessageModal({
  film,
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
        <Form.Item
          label="Film ID"
          name="filmId"
          rules={[{ required: true, message: "Film ID is required." }]}
        >
          <Input disabled={Boolean(film)} placeholder="Film id" />
        </Form.Item>
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
