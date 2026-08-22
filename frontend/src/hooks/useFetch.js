import { useState, useEffect } from "react";
import { BASE_URL } from "../api/client";

function useFetch(url) {
  const cacheKey = `portfolio_cache_${url}`;
  
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem(cacheKey);
    } catch (e) {
      return true;
    }
  });

  const [error, setError] = useState(null);

  useEffect(() => {
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
      .then((resData) => {
        setData(resData);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(resData));
        } catch (e) {}
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

export default useFetch;