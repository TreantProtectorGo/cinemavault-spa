import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, Skeleton, Space, Typography, message } from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFilms } from "../api/films";
import { getMyMessages, sendMessage } from "../api/messages";
import { MessageStatusTag } from "../components/MessageStatusTag";
import { SendMessageModal } from "../components/SendMessageModal";
import type { Film, MessageCollectionResponse, MessageCreateRequest } from "../types";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not yet";
}

export function MessagesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [messagesResponse, setMessagesResponse] =
    useState<MessageCollectionResponse | null>(null);
  const [filmOptions, setFilmOptions] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilmsLoading, setIsFilmsLoading] = useState(false);
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

  const loadFilmOptions = useCallback(async () => {
    if (filmOptions.length > 0) {
      return;
    }

    setIsFilmsLoading(true);

    try {
      const result = await getFilms({
        isLive: true,
        limit: 100,
        order: "asc",
        page: 1,
        sortBy: "title",
      });
      setFilmOptions(result.data);
    } catch (error) {
      messageApi.error(`${getApiErrorMessage(error)} Could not load films for message form.`);
    } finally {
      setIsFilmsLoading(false);
    }
  }, [filmOptions.length, messageApi]);

  useEffect(() => {
    if (isSendModalOpen) {
      void loadFilmOptions();
    }
  }, [isSendModalOpen, loadFilmOptions]);

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
      <div className="page-toolbar">
        <Typography.Text type="secondary">
          Send questions to the CinemaVault admin team and review replies.
        </Typography.Text>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => void loadMessages()}>
            Refresh
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsSendModalOpen(true);
            }}
          >
            New message
          </Button>
        </Space>
      </div>

      {errorMessage ? (
        <Alert showIcon type="error" title="Could not load messages" description={errorMessage} />
      ) : null}

      <Card className="message-card">
        {isLoading ? (
          <div className="message-list">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="message-list-item" key={index}>
                <MessageOutlined className="message-list-icon" />
                <Skeleton active paragraph={{ rows: 3 }} title />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <Empty description="No messages yet." />
        ) : (
          <div className="message-list">
            {messages.map((item) => (
              <article className="message-list-item" key={item.id}>
                <MessageOutlined className="message-list-icon" />
                <div className="message-stack">
                  <Space wrap>
                    <Typography.Text strong>{item.subject}</Typography.Text>
                    <MessageStatusTag status={item.status} />
                  </Space>
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
              </article>
            ))}
          </div>
        )}
      </Card>

      <SendMessageModal
        filmOptions={filmOptions}
        filmsLoading={isFilmsLoading}
        open={isSendModalOpen}
        submitting={isSubmitting}
        onCancel={() => setIsSendModalOpen(false)}
        onSubmit={handleSendMessage}
      />
    </section>
  );
}
