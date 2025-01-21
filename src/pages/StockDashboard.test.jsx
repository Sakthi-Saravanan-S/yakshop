import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import StockDashboard from "./StockDashboard";
import stockReducer from "../store/stockSlice";
import orderReducer from "../store/orderSlice";
import themeReducer from "../store/themeSlice";
import userEvent from '@testing-library/user-event';

jest.mock("./StockDashboard.scss", () => ({}));
jest.mock("../utils", () => ({
  calculateMilkProductionPerDay: jest.fn().mockReturnValue(10),
  calculateWoolStock: jest.fn().mockReturnValue(5),
}));
jest.mock("recharts", () => ({
  PieChart: jest.fn().mockReturnValue(null),
  Pie: jest.fn().mockReturnValue(null),
  Cell: jest.fn().mockReturnValue(null),
  Tooltip: jest.fn().mockReturnValue(null),
  Legend: jest.fn().mockReturnValue(null),
  BarChart: jest.fn().mockReturnValue(null),
  Bar: jest.fn().mockReturnValue(null),
  XAxis: jest.fn().mockReturnValue(null),
  YAxis: jest.fn().mockReturnValue(null),
  CartesianGrid: jest.fn().mockReturnValue(null),
  ResponsiveContainer: jest.fn().mockReturnValue(null),
  LineChart: jest.fn().mockReturnValue(null),
  Line: jest.fn().mockReturnValue(null),
}));

const mockStore = configureStore({
  reducer: {
    stock: stockReducer,
    order: orderReducer,
    theme: themeReducer,
  },
  preloadedState: {
    stock: {
      herd: [{ id: 1, name: "Yak1", age: 2 }],
      milkStock: 100,
      woolStock: 50,
    },
    order: {
      orderHistory: [
        { orderStatus: "pending", milk: 10, wool: 5, milkCost: 20, woolCost: 15, totalCost: 35, date: "2025-01-20" },
      ],
    },
    theme: {
      darkMode: false,
    },
  },
});

describe("StockDashboard Component", () => {
  it("should render StockDashboard with data", async () => {
    render(
      <Provider store={mockStore}>
        <StockDashboard />
      </Provider>
    );

    expect(screen.getByText("Overall Revenue Comparison By Orders")).toBeInTheDocument();
    expect(screen.getByText("Milk Production Comparison (Liters)")).toBeInTheDocument();
    expect(screen.getByText("Wool Production Comparison (Skins)")).toBeInTheDocument();
    expect(screen.getByText("Overall Milk and Wool Stock Levels")).toBeInTheDocument();
    expect(screen.queryByText(/No Orders Placed Yet/i)).not.toBeInTheDocument();
  });

  it("should filter herd based on selected Yak", async () => {
    render(
      <Provider store={mockStore}>
        <StockDashboard />
      </Provider>
    );
  
    const filter = screen.getByLabelText(/Filter by Yak/i);
    userEvent.click(filter);
    const yakOption = await screen.findByText("Yak1");
    userEvent.click(yakOption);
  
    await waitFor(() => expect(screen.getByText(/Milk Production Comparison/i)).toBeInTheDocument());
  });

  it("should render 'No herd data available' if herd is empty", async () => {
    const emptyStore = configureStore({
      reducer: {
        stock: stockReducer,
        order: orderReducer,
        theme: themeReducer,
      },
      preloadedState: {
        stock: {
          herd: [],
          milkStock: 100,
          woolStock: 50,
        },
        order: {
          orderHistory: [
            { orderStatus: "pending", milk: 10, wool: 5, milkCost: 20, woolCost: 15, totalCost: 35, date: "2025-01-20" },
          ],
        },
        theme: {
          darkMode: false,
        },
      },
    });

    render(
      <Provider store={emptyStore}>
        <StockDashboard />
      </Provider>
    );

    expect(screen.getByText(/No herd data available/i)).toBeInTheDocument();
  });

  it("should toggle dark mode class", async () => {
    const darkModeStore = configureStore({
      reducer: {
        stock: stockReducer,
        order: orderReducer,
        theme: themeReducer,
      },
      preloadedState: {
        stock: {
          herd: [{ id: 1, name: "Yak1", age: 2 }],
          milkStock: 100,
          woolStock: 50,
        },
        order: {
          orderHistory: [
            { orderStatus: "pending", milk: 10, wool: 5, milkCost: 20, woolCost: 15, totalCost: 35, date: "2025-01-20" },
          ],
        },
        theme: {
          darkMode: true,
        },
      },
    });

    const { container } = render(
      <Provider store={darkModeStore}>
        <StockDashboard />
      </Provider>
    );

    expect(container.firstChild).toHaveClass("dark");
  });
});
