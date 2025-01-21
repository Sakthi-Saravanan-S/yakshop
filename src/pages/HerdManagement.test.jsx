import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import HerdManagement from "./HerdManagement";

jest.mock("./HerdManagement.scss", () => ({}));
jest.mock("../utils", () => ({
  calculateOverallMilkProductionPerYak: jest.fn(() => 100),
  calculateWoolStock: jest.fn(() => 5),
  calculateMilkProductionPerDay: jest.fn(() => 10),
  calculateShaveFrequency: jest.fn(() => 7),
}));
jest.mock("../components/CustomTable", () => {
  return jest.fn(({ rows, columns, darkMode }) => (
    <div data-testid="custom-table">
      <p>{`Dark mode is ${darkMode}`}</p>
      {rows.map((row) => (
        <p key={row.id}>{row.name}</p>
      ))}
    </div>
  ));
});
jest.mock("../store/stockSlice", () => ({
  getHerd: jest.fn(() => ({ type: "GET_HERD" })),
}));

const mockStore = configureMockStore();

describe("HerdManagement Component", () => {
  it("should render the loading message when herd data is empty", () => {
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

    expect(screen.getByTestId("custom-table")).toBeInTheDocument();
    expect(screen.getByText("Yak1")).toBeInTheDocument();
    expect(screen.getByText("Yak2")).toBeInTheDocument();
    expect(screen.getByText("Dark mode is true")).toBeInTheDocument();
  });
});
