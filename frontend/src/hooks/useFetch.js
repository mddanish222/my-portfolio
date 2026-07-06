// usefetch.js
import { useState, useEffect } from "react";
import { BASE_URL } from "../api/client";

function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const baseUrl = BASE_URL;
    const targetUrl = url.startsWith("http")
      ? url
      : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

export default useFetch;