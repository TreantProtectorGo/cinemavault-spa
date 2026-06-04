import { useCallback, useEffect, useState } from "react";
import { Alert, message } from "antd";
import { getApiErrorMessage } from "../api/client";
import { getFavourites, removeFavourite } from "../api/tracking";
import { TrackingFilmList } from "../components/TrackingFilmList";
import type { Favourite, TrackingCollectionResponse } from "../types";

export function FavouritesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [response, setResponse] = useState<TrackingCollectionResponse<Favourite> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFavourites = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      setResponse(await getFavourites());
    } catch (error) {
      setResponse(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavourites();
  }, [loadFavourites]);

  async function handleRemove(record: Favourite) {
    try {
      await removeFavourite(record.filmId);
      messageApi.success("Removed from favourites.");
      await loadFavourites();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    }
  }

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading">
        <h1>Favourites</h1>
        <p>Your saved films for quick access.</p>
      </div>

      {errorMessage ? (
        <Alert
          showIcon
          type="error"
          title="Could not load favourites"
          description={`${errorMessage} Please login again if your session expired.`}
        />
      ) : null}

      <TrackingFilmList
        emptyText="No favourites yet."
        loading={loading}
        records={response?.data ?? []}
        removeLabel="Remove this film from favourites?"
        onRemove={handleRemove}
      />
    </section>
  );
}
