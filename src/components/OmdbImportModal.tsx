import { Button, Form, Input, Modal } from "antd";
import type { OmdbImportRequest } from "../types";

type OmdbImportModalProps = {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: OmdbImportRequest) => Promise<void>;
};

function cleanOmdbValues(values: OmdbImportRequest) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== ""),
  ) as OmdbImportRequest;
}

export function OmdbImportModal({
  onCancel,
  onSubmit,
  open,
  submitting,
}: OmdbImportModalProps) {
  const [form] = Form.useForm<OmdbImportRequest>();

  async function handleFinish(values: OmdbImportRequest) {
    await onSubmit(cleanOmdbValues(values));
    form.resetFields();
  }

  return (
    <Modal
      destroyOnHidden
      footer={null}
      open={open}
      title="Import from OMDB"
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item
          label="IMDb ID"
          name="imdbId"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value || getFieldValue("title")) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Enter either IMDb ID or title."));
              },
            }),
          ]}
        >
          <Input placeholder="tt0133093" />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value || getFieldValue("imdbId")) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Enter either title or IMDb ID."));
              },
            }),
          ]}
        >
          <Input placeholder="The Matrix" />
        </Form.Item>

        <div className="modal-actions">
          <Button onClick={onCancel}>Cancel</Button>
          <Button htmlType="submit" loading={submitting} type="primary">
            Import film
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
