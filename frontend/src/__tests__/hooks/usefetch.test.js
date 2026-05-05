/* usefetch.test.js */
import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../../hooks/usefetch.js";

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test("fetch success", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "ok" }),
  });

  const { result } = renderHook(() => useFetch("/api"));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual({ message: "ok" });
});

test("fetch error", async () => {
  fetch.mockRejectedValueOnce(new Error("fail"));

  const { result } = renderHook(() => useFetch("/api"));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.error).toBeTruthy();
});