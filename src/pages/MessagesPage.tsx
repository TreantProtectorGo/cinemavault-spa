import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, List, Space, Typography, message } from "antd";
import { getApiErrorMessage } from "../api/client";
import { getMyMessages, sendMessage } from "../api/messages";
import { MessageStatusTag } from "../components/MessageStatusTag";
import { SendMessageModal } from "../components/SendMessageModal";
import type { Message, MessageCollectionResponse, MessageCreateRequest } from "../types";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not yet";
}

export function MessagesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [messagesResponse, setMessagesResponse] =
    useState<MessageCollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMyMessages();
      setMessagesResponse(result);
    } catch (error) {
      setMessagesResponse(null);
      setErrorMessage(`${getApiErrorMessage(error)} Please login again if your session expired.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function handleSendMessage(values: MessageCreateRequest) {
    setIsSubmitting(true);

    try {
      await sendMessage(values);
      messageApi.success("Message sent to admin.");
      setIsSendModalOpen(false);
      await loadMessages();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const messages = messagesResponse?.data ?? [];

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading admin-heading">
        <div>
          <h1>Messages</h1>
          <p>Send questions to the CinemaVault admin team and review replies.</p>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => void loadMessages()}>
            Refresh
          </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsSendModalOpen(true)}>
            New message
          </Button>
        </Space>
      </div>

      {errorMessage ? (
        <Alert showIcon type="error" message="Could not load messages" description={errorMessage} />
      ) : null}

      <Card className="message-card">
        <List<Message>
          dataSource={messages}
          loading={isLoading}
          locale={{ emptyText: <Empty description="No messages yet." /> }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<MessageOutlined className="message-list-icon" />}
                title={
                  <Space wrap>
                    <Typography.Text strong>{item.subject}</Typography.Text>
                    <MessageStatusTag status={item.status} />
                  </Space>
                }
                description={
                  <div className="message-stack">
                    <Typography.Text type="secondary">
                      Film:{" "}
                      {item.film ? (
                        <Link to={`/films/${item.filmId}`}>{item.film.title}</Link>
                      ) : (
                        item.filmId
                      )}
                    </Typography.Text>
                    <Typography.Paragraph>{item.body}</Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Created: {formatDate(item.createdAt)}
                    </Typography.Text>
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
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <SendMessageModal
        open={isSendModalOpen}
        submitting={isSubmitting}
        onCancel={() => setIsSendModalOpen(false)}
        onSubmit={handleSendMessage}
      />
    </section>
  );
}
