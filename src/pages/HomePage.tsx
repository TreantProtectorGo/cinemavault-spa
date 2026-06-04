import {
  ArrowRightOutlined,
  HeartOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Button, Card, Tag } from "antd";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
  const { isAdmin, isAuthenticated, user } = useAuth();

  return (
    <section className="page-stack">
      <div className="home-hero">
        <div className="home-hero-copy">
          <Tag color="blue">Film discovery workspace</Tag>
          <h1>CinemaVault</h1>
          <p>
            Find films worth watching, keep your personal lists organised, and
            ask the team about titles directly from the catalogue.
          </p>
          <div className="home-hero-actions">
            <Link to="/films">
              <Button icon={<SearchOutlined />} type="primary">
                Explore films
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/watchlist">
                <Button icon={<ArrowRightOutlined />}>Open watchlist</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="home-hero-panel">
          <div className="home-panel-kicker">
            {isAuthenticated ? `Welcome back, ${user?.username ?? "member"}` : "Start browsing"}
          </div>
          <div className="home-panel-title">Build a list for tonight</div>
          <div className="home-panel-tags">
            <Tag>Animation</Tag>
            <Tag>Sci-Fi</Tag>
            <Tag>Drama</Tag>
            <Tag>Thriller</Tag>
          </div>
          <div className="home-panel-actions">
            {isAuthenticated ? (
              <Link to="/messages">
                <Button block icon={<MessageOutlined />}>
                  Message admin
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="home-feature-grid">
        <Card className="home-feature-card">
          <SearchOutlined />
          <h2>Find a film fast</h2>
          <p>Search by title, filter by genre or year, and sort the catalogue your way.</p>
        </Card>
        <Card className="home-feature-card">
          <HeartOutlined />
          <h2>Save what matters</h2>
          <p>Keep favourites, plan your watchlist, and record films you have watched.</p>
        </Card>
        <Card className="home-feature-card">
          <MessageOutlined />
          <h2>Ask about a title</h2>
          <p>Send a film-specific question and keep replies in your message history.</p>
        </Card>
        <Card className="home-feature-card">
          <PlayCircleOutlined />
          <h2>{isAdmin ? "Manage the library" : "Browse with confidence"}</h2>
          <p>
            {isAdmin
              ? "Add, edit, import, and publish film records from the admin dashboard."
              : "Open film detail pages with posters, ratings, cast, runtime, and plot notes."}
          </p>
        </Card>
      </div>
    </section>
  );
}
