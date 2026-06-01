import { ApiOutlined, SafetyCertificateOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Card } from "antd";
import { PlaceholderPanel } from "../components/PlaceholderPanel";
import { useApiBaseUrl } from "../hooks/useApiBaseUrl";

export function HomePage() {
  const apiBaseUrl = useApiBaseUrl();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>CinemaVault workspace</h1>
        <p>
          React TypeScript scaffold for the secure film discovery SPA. Full
          feature wiring will be added in later phases.
        </p>
      </div>

      <Alert
        type="info"
        showIcon
        message="Backend dependency"
        description={`Configured API base URL: ${apiBaseUrl}`}
      />

      <div className="summary-grid">
        <PlaceholderPanel title="Public browsing" icon={<VideoCameraOutlined />}>
          Placeholder for public film listing, filters, search, and film detail
          navigation.
        </PlaceholderPanel>
        <PlaceholderPanel title="Secure user flows" icon={<SafetyCertificateOutlined />}>
          Placeholder for JWT login, registration, favourites, watchlist, watched
          records, and messages.
        </PlaceholderPanel>
        <PlaceholderPanel title="Admin tools" icon={<ApiOutlined />}>
          Placeholder for admin-only film management, OMDB import, and message
          replies.
        </PlaceholderPanel>
      </div>

      <Card title="Phase 8.0 scope">
        <div className="status-strip">
          <div className="status-item">
            <strong>Router</strong>
            <span>Configured with placeholder routes</span>
          </div>
          <div className="status-item">
            <strong>UI library</strong>
            <span>Ant Design installed and themed</span>
          </div>
          <div className="status-item">
            <strong>API client</strong>
            <span>Axios wrapper reads VITE_API_BASE_URL</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
