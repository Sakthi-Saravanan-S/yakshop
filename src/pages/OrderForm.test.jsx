import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import axios from 'axios'; 
import orderReducer from "../store/orderSlice";
import stockReducer from "../store/stockSlice";
import themeReducer from "../store/themeSlice";
import OrderForm from "./OrderForm";

jest.mock('axios');
jest.mock("./OrderForm.scss", () => ({}));
jest.mock("../components/CustomTable", () => {
  return jest.fn(() => (
    <div data-testid="custom-table">CustomTable Mocked</div>
  ));
});

describe("OrderForm", () => {
  const renderWithStore = (initialState) => {
    const store = configureStore({
      reducer: {
        order: orderReducer,
        stock: stockReducer,
        theme: themeReducer,
      },
      preloadedState: initialState,
    });

    render(
      <Provider store={store}>
        <OrderForm />
      </Provider>
    );

    return store;
  };

  test("renders correctly and handles form submission", async () => {
    const initialState = {
      stock: { milkStock: 500, woolStock: 500 },
      order: { orderHistory: [] },
      theme: { darkMode: false },
    };

    renderWithStore(initialState);

    axios.post.mockResolvedValueOnce({ data: {}});
    await userEvent.type(screen.getByLabelText(/Milk \(liters\)/i), "100");
    await userEvent.type(screen.getByLabelText(/Wool \(skins\)/i), "50");
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    const successMessage = await screen.findByText(
      /Order placed successfully!/i
    );
    expect(successMessage).toBeInTheDocument();
  });

  test("shows error message when fields are empty", async () => {
    const initialState = {
      stock: { milkStock: 500, woolStock: 500 },
      order: { orderHistory: [] },
      theme: { darkMode: false },
    };

    renderWithStore(initialState);

    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    const errorMessage = await screen.findByText(
      /Either milk or wool amount is required./i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
