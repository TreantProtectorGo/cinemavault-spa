import type { ReactNode } from "react";
import { Card, Space, Tag, Typography } from "antd";

type PlaceholderPanelProps = {
  title: string;
  status?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function PlaceholderPanel({
  title,
  status = "Scaffold",
  icon,
  children,
}: PlaceholderPanelProps) {
  return (
    <Card
      className="placeholder-card"
      title={
        <Space>
          {icon}
          <span>{title}</span>
        </Space>
      }
      extra={<Tag color="blue">{status}</Tag>}
    >
      <Typography.Paragraph type="secondary">{children}</Typography.Paragraph>
    </Card>
  );
}
