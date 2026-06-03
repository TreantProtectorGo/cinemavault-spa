import { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import type { Message, MessageReplyRequest } from "../types";

type ReplyMessageModalProps = {
  message: Message | null;
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (id: string, values: MessageReplyRequest) => Promise<void>;
};

export function ReplyMessageModal({
  message,
  onCancel,
  onSubmit,
  open,
  submitting,
}: ReplyMessageModalProps) {
  const [form] = Form.useForm<MessageReplyRequest>();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (message?.replyBody) {
      form.setFieldsValue({ replyBody: message.replyBody });
    }
  }, [form, message, open]);

  async function handleFinish(values: MessageReplyRequest) {
    if (!message) {
      return;
    }

    await onSubmit(message.id, values);
    form.resetFields();
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title={message ? `Reply to ${message.subject}` : "Reply to message"}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item
          label="Reply"
          name="replyBody"
          rules={[
            { required: true, message: "Reply is required." },
            { max: 5000, message: "Reply is too long." },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
        </Form.Item>

        <div className="modal-actions">
          <Button onClick={onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            Send reply
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
