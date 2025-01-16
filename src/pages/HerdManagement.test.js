import { render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { getHerd } from "../store/stockSlice";
import { calculateMilkProduction, calculateWoolStock } from "../utils";
import HerdManagement from "./HerdManagement";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../store/stockSlice", () => ({
  getHerd: jest.fn(),
}));

jest.mock("../utils", () => ({
  calculateMilkProduction: jest.fn(),
  calculateWoolStock: jest.fn(),
}));

describe("HerdManagement Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === ((state) => state.stock.herd)) {
        return [
          { id: 1, name: "Betty-1", age: 4 },
          { id: 2, name: "Betty-2", age: 8 },
        ];
      }
      if (selectorFn === ((state) => state.theme.darkMode)) {
        return false; // Default to light mode
      }
      return null;
    });

    calculateMilkProduction.mockImplementation((ageInDays) => ageInDays * 0.03);
    calculateWoolStock.mockImplementation((ageInDays) => Math.floor(ageInDays / 50));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the loading message when herd data is empty", () => {
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === ((state) => state.stock.herd)) {
        return [];
      }
      return null;
    });

    render(<HerdManagement />);

    expect(screen.getByText("Loading herd data...")).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(getHerd());
  });

  test("renders the herd table with correct data", () => {
    render(<HerdManagement />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age (in Years and Days)")).toBeInTheDocument();
    expect(screen.getByText("Milk Production (Liters/Day)")).toBeInTheDocument();
    expect(screen.getByText("Wool Stock (Skins)")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3); // Header + 2 data rows

    expect(screen.getByText("Betty-1")).toBeInTheDocument();
    expect(screen.getByText("4 Years, 0 Days")).toBeInTheDocument();
    expect(screen.getByText("4.00")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Betty-2")).toBeInTheDocument();
    expect(screen.getByText("8 Years, 0 Days")).toBeInTheDocument();
    expect(screen.getByText("8.00")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("applies dark mode class when darkMode is true", () => {
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === ((state) => state.stock.herd)) {
        return [{ id: 1, name: "Betty-1", age: 4 }];
      }
      if (selectorFn === ((state) => state.theme.darkMode)) {
        return true;
      }
      return null;
    });

    render(<HerdManagement />);

    const container = screen.getByRole("table");
    expect(container).toHaveClass("dark");
  });
});
