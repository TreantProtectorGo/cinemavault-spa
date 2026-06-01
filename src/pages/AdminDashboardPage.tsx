import {
  ApiOutlined,
  DashboardOutlined,
  MessageOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function AdminDashboardPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Admin dashboard</h1>
        <p>Placeholder page for protected admin workflows.</p>
      </div>

      <div className="summary-grid">
        <PlaceholderPanel title="RBAC gate" icon={<DashboardOutlined />}>
          Later phase will protect this page using JWT role checks.
        </PlaceholderPanel>
        <PlaceholderPanel title="Film management" icon={<VideoCameraAddOutlined />}>
          Later phase will add create, update, delete, and OMDB import controls.
        </PlaceholderPanel>
        <PlaceholderPanel title="Messages" icon={<MessageOutlined />}>
          Later phase will show admin message inbox and reply actions.
        </PlaceholderPanel>
        <PlaceholderPanel title="API documentation" icon={<ApiOutlined />}>
          Backend docs are expected at `/api-docs` on the API server.
        </PlaceholderPanel>
      </div>
    </section>
  );
}
