// App.test.jsx
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import themeReducer from "./store/themeSlice";

jest.mock("./components/NavBar.scss", () => ({}));
jest.mock("./components/CustomTable.scss", () => ({}));
jest.mock("./pages/HerdManagement.scss", () => ({}));
jest.mock("./pages/StockDashboard.scss", () => ({}));
jest.mock("./pages/OrderForm.scss", () => ({}));
jest.mock("./pages/HerdManagement", () => () => <div>Herd Management</div>);
jest.mock("./pages/StockDashboard", () => () => <div>Stock Dashboard</div>);
jest.mock("./pages/OrderForm", () => () => <div>Order Form</div>);


const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

describe("App Component", () => {
  test("should render Navbar and Routes correctly with light theme", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(document.body).toHaveStyle("background-color: #f7f7f7");
  });

  test("should render dark theme when darkMode is true", () => {
    const darkModeStore = configureStore({
      reducer: {
        theme: themeReducer,
      },
      preloadedState: {
        theme: {
          darkMode: true,
        },
      },
    });

    render(
      <Provider store={darkModeStore}>
        <App />
      </Provider>
    );

    expect(document.body).toHaveStyle("background-color: #121212");
  });
});
