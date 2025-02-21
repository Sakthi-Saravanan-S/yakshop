# YakShop Web Application

## Overview
The **YakShop** web application is designed to help the Yak Shepherd manage their herd of LabYaks, track stock levels for milk and wool, and fulfill customer orders. This platform simplifies herd management and enhances the shopping experience for global customers.

---

## Features

### 1. **Herd Management**
- Display the herd's details in a table or cards.
- Track each Yak's name, age (in years and days), and last shaved day.
- Dynamically update Yak ages based on elapsed days.

### 2. **Stock Management**
- Dashboard displaying stock levels for milk and wool.
- Real-time calculations of milk and wool stock based on herd data.
- Filtering options by specific Yaks or date ranges.
- Visual stock trends using charts.

### 3. **Customer Orders**
- Form to place orders for milk and wool.
- Stock deduction upon successful order placement.
- Notifications for partial or unsuccessful order fulfillment.

### 4. **REST API Integration**
- Fetch stock: `GET /yak-shop/stock/:T`
- Fetch herd: `GET /yak-shop/herd/:T`
- Place orders: `POST /yak-shop/order/:T`

---

## Folder Structure

```plaintext
src/
├── api/
│   └── yakApi.js       # Handles API calls for herd and stock data
├── components/
│   └── NavBar.jsx      # Navigation bar component
├── pages/
│   ├── HerdManagement.jsx # Page for managing and viewing herd details
│   ├── StockDashboard.jsx # Page for viewing stock levels and trends
│   └── OrderForm.jsx       # Page for placing customer orders
├── store/
│   ├── orderSlice.js   # Redux slice for managing orders
│   ├── stockSlice.js   # Redux slice for managing stock
│   ├── themeSlice.js   # Redux slice for managing theme settings
│   └── store.js        # Centralized Redux store setup
```

---

## Technologies Used

### Frontend
- **React**: Core library for building the user interface.
- **Material UI (MUI)**: Styling and UI components.
- **Recharts**: Visualizing stock trends.
- **Sass**: Enhanced styling with modular CSS.

### State Management
- **Redux Toolkit**: Centralized state management for orders, stock, and theme.

### Backend
- **JSON Server**: Mock REST API for development.

### Testing
- **Jest**: Unit testing framework.
- **@testing-library/react**: Testing React components.

---

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sakthi-Saravanan-S/yakshop.git
   cd yakshop
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the JSON Server**:
   ```bash
   npm run server
   ```
   This will start the JSON server on port `5000`.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Run Tests**:
   ```bash
   npm run test
   ```

---

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for linting issues.
- `npm run preview`: Previews the production build.
- `npm run server`: Starts the JSON server for API testing.
- `npm run test`: Runs the test suite using Jest.

---

## REST API Endpoints

### Herd
- **GET** `/yak-shop/herd/:T`: Fetch the herd's details as of day `T`.

### Stock
- **GET** `/yak-shop/stock/:T`: Fetch stock levels for milk and wool as of day `T`.

### Order
- **POST** `/yak-shop/order/:T`: Place an order for milk and wool.

---
