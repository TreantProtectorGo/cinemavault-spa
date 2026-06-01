import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function FilmDetailPage() {
  const { id } = useParams();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Film detail</h1>
        <p>Placeholder page for one film record and user actions.</p>
      </div>

      <PlaceholderPanel title="Selected film">
        <Descriptions
          bordered
          column={1}
          size="small"
          items={[
            {
              key: "id",
              label: "Route id",
              children: id ?? "Not supplied",
            },
            {
              key: "next",
              label: "Later phase",
              children: "Fetch GET /api/v1/films/:id and show tracking actions.",
            },
          ]}
        />
      </PlaceholderPanel>
    </section>
  );
}
