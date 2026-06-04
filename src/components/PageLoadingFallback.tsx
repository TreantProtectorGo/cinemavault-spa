import { Card, Spin, Typography } from "antd";

export function PageLoadingFallback() {
  return (
    <Card className="route-loading-card">
      <Spin size="large" />
      <Typography.Text type="secondary">Loading CinemaVault page...</Typography.Text>
    </Card>
  );
}
