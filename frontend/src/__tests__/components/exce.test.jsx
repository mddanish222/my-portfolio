import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Experience, Certifications } from "../../components/Exce.jsx";

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("Experience Component", () => {

  test("shows loading initially", () => {
  fetch.mockImplementation(() => new Promise(() => {}));

  render(<Experience />);

  const skeletons = document.querySelectorAll(".exce-skeleton");
  expect(skeletons.length).toBeGreaterThan(0);
});

  test("renders experience data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          id: 1,
          role: "Intern",
          company: "ABC",
          location: "India",
          period: "2024",
          stipend: "₹5000",
          points: ["Worked on React"]
        }
      ])
    });

    render(<Experience />);

    await waitFor(() => {
      expect(screen.getByText("Intern")).toBeInTheDocument();
    });
  });

  test("handles error", async () => {
    fetch.mockRejectedValueOnce(new Error("Fail"));

    render(<Experience />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load experience/i)).toBeInTheDocument();
    });
  });

});


describe("Certifications Component", () => {

  test("renders certifications data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          id: 1,
          title: "React Course",
          issuer: "Udemy",
          note: "Completed"
        }
      ])
    });

    render(<Certifications />);

    await waitFor(() => {
      expect(screen.getByText("React Course")).toBeInTheDocument();
    });
  });

});