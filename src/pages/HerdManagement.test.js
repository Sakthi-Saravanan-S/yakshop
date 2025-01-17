import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import HerdManagement from "./HerdManagement";

jest.mock("../utils", () => ({
  calculateOverallMilkProductionPerYak: jest.fn(() => 100),
  calculateWoolStock: jest.fn(() => 5),
  calculateMilkProductionPerDay: jest.fn(() => 10),
  calculateShaveFrequency: jest.fn(() => 7),
}));

const mockStore = configureMockStore();

describe("HerdManagement Component", () => {
  test("should render the loading message when herd data is empty", () => {
    const store = mockStore({
      stock: { herd: [] },
      theme: { darkMode: false },
    });

    render(
      <Provider store={store}>
        <HerdManagement />
      </Provider>
    );

    expect(screen.getByText("Loading herd data...")).toBeInTheDocument();
  });

  it("should render the CustomTable with herd data", () => {
    const store = mockStore({
      stock: {
        herd: [
          { name: "Yak1", age: 4 },
          { name: "Yak2", age: 6 },
        ],
      },
      theme: { darkMode: true },
    });

    render(
      <Provider store={store}>
        <HerdManagement />
      </Provider>
    );

    expect(screen.getByText("Yak1")).toBeInTheDocument();
    expect(screen.getByText("Yak2")).toBeInTheDocument();
    expect(screen.getByText("4 Years, 0 Days")).toBeInTheDocument();
    expect(screen.getByText("6 Years, 0 Days")).toBeInTheDocument();
    expect(screen.getByText("100 L")).toBeInTheDocument(); // Mocked milk production
    expect(screen.getByText("5")).toBeInTheDocument(); // Mocked wool stock
  });
});
