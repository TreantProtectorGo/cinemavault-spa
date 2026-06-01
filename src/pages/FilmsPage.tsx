import { SearchOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function FilmsPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Films</h1>
        <p>Placeholder page for public film browsing, search, filters, and sorting.</p>
      </div>

      <div className="summary-grid">
        <PlaceholderPanel title="Film catalogue" icon={<VideoCameraOutlined />}>
          Later phase will call `GET /api/v1/films` and render live backend data.
        </PlaceholderPanel>
        <PlaceholderPanel title="Search and filters" icon={<SearchOutlined />}>
          Later phase will bind title, genre, year, rating, sort, page, and limit
          query parameters.
        </PlaceholderPanel>
      </div>
    </section>
  );
}
