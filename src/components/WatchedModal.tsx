import { Button, Form, Input, InputNumber, Modal } from "antd";
import type { WatchedCreateRequest } from "../types";

type WatchedModalProps = {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: WatchedCreateRequest) => Promise<void>;
};

function cleanWatchedValues(values: WatchedCreateRequest) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== ""),
  ) as WatchedCreateRequest;
}

export function WatchedModal({
  onCancel,
  onSubmit,
  open,
  submitting,
}: WatchedModalProps) {
  const [form] = Form.useForm<WatchedCreateRequest>();

  async function handleFinish(values: WatchedCreateRequest) {
    await onSubmit(cleanWatchedValues(values));
    form.resetFields();
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title="Mark as watched"
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item label="Your rating" name="rating">
          <InputNumber className="full-width" max={10} min={1} placeholder="1-10" />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="Optional personal notes"
          />
        </Form.Item>
        <div className="modal-actions">
          <Button onClick={onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            Save watched record
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
