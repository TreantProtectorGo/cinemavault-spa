import { useCallback, useEffect, useState } from "react";
import { Alert, message } from "antd";
import { getApiErrorMessage } from "../api/client";
import { getWatched, removeWatched } from "../api/tracking";
import { TrackingFilmList } from "../components/TrackingFilmList";
import type { TrackingCollectionResponse, WatchedRecord } from "../types";

export function WatchedPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [response, setResponse] = useState<TrackingCollectionResponse<WatchedRecord> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWatched = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      setResponse(await getWatched());
    } catch (error) {
      setResponse(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWatched();
  }, [loadWatched]);

  async function handleRemove(record: WatchedRecord) {
    try {
      await removeWatched(record.filmId);
      messageApi.success("Removed watched record.");
      await loadWatched();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    }
  }

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading">
        <h1>Watched</h1>
        <p>Your watched films and personal ratings.</p>
      </div>

      {errorMessage ? (
        <Alert
          showIcon
          type="error"
          title="Could not load watched records"
          description={`${errorMessage} Please login again if your session expired.`}
        />
      ) : null}

      <TrackingFilmList
        emptyText="No watched films yet."
        loading={loading}
        records={response?.data ?? []}
        removeLabel="Remove this watched record?"
        onRemove={handleRemove}
      />
    </section>
  );
}
