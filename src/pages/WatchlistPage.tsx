import { useCallback, useEffect, useState } from "react";
import { Alert, message } from "antd";
import { getApiErrorMessage } from "../api/client";
import { getWatchlist, removeWatchlistItem } from "../api/tracking";
import { TrackingFilmList } from "../components/TrackingFilmList";
import type { TrackingCollectionResponse, WatchlistItem } from "../types";

export function WatchlistPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [response, setResponse] = useState<TrackingCollectionResponse<WatchlistItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWatchlist = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      setResponse(await getWatchlist());
    } catch (error) {
      setResponse(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWatchlist();
  }, [loadWatchlist]);

  async function handleRemove(record: WatchlistItem) {
    try {
      await removeWatchlistItem(record.filmId);
      messageApi.success("Removed from watchlist.");
      await loadWatchlist();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    }
  }

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading">
        <h1>Watchlist</h1>
        <p>Films you plan to watch.</p>
      </div>

      {errorMessage ? (
        <Alert
          showIcon
          type="error"
          title="Could not load watchlist"
          description={`${errorMessage} Please login again if your session expired.`}
        />
      ) : null}

      <TrackingFilmList
        emptyText="Your watchlist is empty."
        loading={loading}
        records={response?.data ?? []}
        removeLabel="Remove this film from watchlist?"
        onRemove={handleRemove}
      />
    </section>
  );
}
