import { ApiOutlined, SafetyCertificateOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Card } from "antd";
import { PlaceholderPanel } from "../components/PlaceholderPanel";
import { useApiBaseUrl } from "../hooks/useApiBaseUrl";

export function HomePage() {
  const apiBaseUrl = useApiBaseUrl();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>CinemaVault</h1>
        <p>
          Secure film discovery workspace with public browsing, authenticated
          saved lists, direct messages, profile management, and admin film tools.
        </p>
      </div>

      <Alert
        type="info"
        showIcon
        title="Backend dependency"
        description={`Configured API base URL: ${apiBaseUrl}`}
      />

      <div className="summary-grid">
        <PlaceholderPanel title="Public browsing" icon={<VideoCameraOutlined />}>
          Search, filter, sort, and open film detail pages from the live backend
          catalogue.
        </PlaceholderPanel>
        <PlaceholderPanel title="Secure user flows" icon={<SafetyCertificateOutlined />}>
          JWT login unlocks favourites, watchlist, watched records, messages, and
          profile photo upload.
        </PlaceholderPanel>
        <PlaceholderPanel title="Admin tools" icon={<ApiOutlined />}>
          Admin-only dashboard supports film management, OMDB import, and message
          replies.
        </PlaceholderPanel>
      </div>

      <Card title="Frontend status">
        <div className="status-strip">
          <div className="status-item">
            <strong>SPA routes</strong>
            <span>Protected user and admin areas are wired</span>
          </div>
          <div className="status-item">
            <strong>API client</strong>
            <span>Axios uses the configured backend URL</span>
          </div>
          <div className="status-item">
            <strong>Documentation</strong>
            <span>Backend OpenAPI docs remain available at /api-docs</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
