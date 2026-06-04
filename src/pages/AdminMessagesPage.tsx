import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  ReloadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { getApiErrorMessage } from "../api/client";
import { deleteMessage, getAdminMessages, replyToMessage } from "../api/messages";
import { MessageStatusTag } from "../components/MessageStatusTag";
import { ReplyMessageModal } from "../components/ReplyMessageModal";
import type {
  AdminMessageQuery,
  Message,
  MessageCollectionResponse,
  MessageReplyRequest,
  MessageStatus,
} from "../types";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not yet";
}

export function AdminMessagesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [query, setQuery] = useState<AdminMessageQuery>({});
  const [messagesResponse, setMessagesResponse] =
    useState<MessageCollectionResponse | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getAdminMessages(query);
      setMessagesResponse(result);
    } catch (error) {
      setMessagesResponse(null);
      setErrorMessage(`${getApiErrorMessage(error)} Please login again if your admin session expired.`);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function handleReply(id: string, values: MessageReplyRequest) {
    setIsSubmitting(true);

    try {
      await replyToMessage(id, values);
      messageApi.success("Reply sent.");
      setIsReplyModalOpen(false);
      setSelectedMessage(null);
      await loadMessages();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item: Message) {
    setIsSubmitting(true);

    try {
      await deleteMessage(item.id);
      messageApi.success("Message deleted.");
      await loadMessages();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns: ColumnsType<Message> = [
    {
      title: "Message",
      dataIndex: "subject",
      key: "subject",
      render: (_, item) => (
        <Space orientation="vertical" size={4}>
          <Typography.Text strong>{item.subject}</Typography.Text>
          <Typography.Text type="secondary">
            From {item.sender?.username ?? item.userId}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Film",
      key: "film",
      render: (_, item) =>
        item.film ? <Link to={`/films/${item.filmId}`}>{item.film.title}</Link> : item.filmId,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: MessageStatus) => <MessageStatusTag status={status} />,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (value: string) => formatDate(value),
    },
    {
      title: "Actions",
      key: "actions",
      width: 210,
      render: (_, item) => (
        <Space wrap>
          <Button
            icon={<SendOutlined />}
            size="small"
            onClick={() => {
              setSelectedMessage(item);
              setIsReplyModalOpen(true);
            }}
          >
            Reply
          </Button>
          <Popconfirm
            title="Delete message?"
            description="This will soft-delete the message."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => void handleDelete(item)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const messages = messagesResponse?.data ?? [];

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading admin-heading">
        <div>
          <h1>Admin messages</h1>
          <p>Review user questions, reply as admin, and soft-delete resolved messages.</p>
        </div>
        <Space wrap>
          <Select
            allowClear
            placeholder="All statuses"
            style={{ width: 160 }}
            value={query.status}
            options={[
              { label: "Open", value: "OPEN" },
              { label: "Replied", value: "REPLIED" },
              { label: "Deleted", value: "DELETED" },
            ]}
            onChange={(status) => setQuery({ status })}
          />
          <Button icon={<ReloadOutlined />} onClick={() => void loadMessages()}>
            Refresh
          </Button>
        </Space>
      </div>

      {errorMessage ? (
        <Alert
          showIcon
          type="error"
          title="Could not load admin messages"
          description={errorMessage}
        />
      ) : null}

      <Card className="admin-table-card" title="Message inbox">
        <Table
          columns={columns}
          dataSource={messages}
          expandable={{
            expandedRowRender: (item) => (
              <div className="message-stack">
                <Typography.Text strong>User message</Typography.Text>
                <Typography.Paragraph>{item.body}</Typography.Paragraph>
                {item.replyBody ? (
                  <div className="reply-panel">
                    <Typography.Text strong>Admin reply</Typography.Text>
                    <Typography.Paragraph>{item.replyBody}</Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Replied: {formatDate(item.repliedAt)}
                    </Typography.Text>
                  </div>
                ) : null}
              </div>
            ),
          }}
          loading={isLoading || isSubmitting}
          locale={{ emptyText: <Empty description="No messages found." /> }}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="id"
          scroll={{ x: 920 }}
        />
      </Card>

      <ReplyMessageModal
        message={selectedMessage}
        open={isReplyModalOpen}
        submitting={isSubmitting}
        onCancel={() => {
          setIsReplyModalOpen(false);
          setSelectedMessage(null);
        }}
        onSubmit={handleReply}
      />
    </section>
  );
}
