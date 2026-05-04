import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Skills from "../../components/skills.jsx";

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("Skills Component", () => {

  test("renders title", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Skills />);
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  test("renders skeleton loading UI", () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<Skills />);

    const boxes = document.querySelectorAll("div[style*='height: 80px']");
    expect(boxes.length).toBeGreaterThan(0);
  });

  test("shows skills data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: 1, name: "React", level: 80 }
      ])
    });

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });
  });

  test("shows empty state", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument();
    });
  });

  test("handles API error", async () => {
    fetch.mockRejectedValueOnce(new Error("Fail"));

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText(/could not load skills/i)).toBeInTheDocument();
    });
  });

});