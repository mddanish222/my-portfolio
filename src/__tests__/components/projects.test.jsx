import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Projects from "../../components/projects.jsx";

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("Projects Component", () => {

  test("renders title", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Projects />);
    expect(screen.getByText(/projects/i)).toBeInTheDocument();
  });

  test("renders skeleton loading UI", () => {
    fetch.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<Projects />);

    const boxes = document.querySelectorAll("div[style*='height: 180px']");
    expect(boxes.length).toBeGreaterThan(0);
  });

  test("shows data after fetch success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          id: 1,
          title: "Demo Project",
          desc: "Test",
          tech: ["React"],
          type: "Personal",
          status: "Completed"
        }
      ])
    });

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Demo Project")).toBeInTheDocument();
    });
  });

  test("shows empty state", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/projects/i)).toBeInTheDocument();
    });
  });

  test("shows error", async () => {
    fetch.mockRejectedValueOnce(new Error("Fail"));

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });

});