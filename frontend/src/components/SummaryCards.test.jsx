import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SummaryCards from "./SummaryCards";

describe("SummaryCards", () => {
  it("displays the total number of servers", () => {
    const servers = [
      {
        id: 1,
        status: "online",
      },
      {
        id: 2,
        status: "offline",
      },
    ];

    render(<SummaryCards servers={servers} />);

    expect(screen.getByText("Total Servers")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
