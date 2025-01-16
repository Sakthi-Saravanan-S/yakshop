import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeCustomerOrder } from "../store/orderSlice";
import { getHerd } from "../store/stockSlice";
import { addOrderToHistory } from "../store/orderSlice"; // Correct import
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import "./OrderForm.scss";

const OrderForm = () => {
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.stock);
  const orderHistory = useSelector((state) => state.order?.orderHistory || []);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [milkAmount, setMilkAmount] = useState("");
  const [woolAmount, setWoolAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [partialMessage, setPartialMessage] = useState("");

  useEffect(() => {
    dispatch(getHerd());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setPartialMessage("");

    const milkAmountNum = parseInt(milkAmount, 10);
    const woolAmountNum = parseInt(woolAmount, 10);

    if (isNaN(milkAmountNum) && isNaN(woolAmountNum)) {
      setError("Either milk or wool amount is required.");
      return;
    }

    setError("");

    if (
      isNaN(milkAmountNum) ||
      isNaN(woolAmountNum) ||
      milkAmountNum < 0 ||
      woolAmountNum < 0
    ) {
      setError("Please enter valid positive numbers for milk and wool.");
      return;
    }

    const milkAvailable = stock.milkStock;
    const woolAvailable = stock.woolStock;

    if (milkAmountNum > milkAvailable && woolAmountNum > woolAvailable) {
      setError("Insufficient stock for both milk and wool.");
      return;
    } else if (milkAmountNum > milkAvailable) {
      setError("Insufficient stock for milk.");
      return;
    } else if (woolAmountNum > woolAvailable) {
      setError("Insufficient stock for wool.");
      return;
    }

    const order = {
      milk: Math.min(milkAmountNum, milkAvailable),
      wool: Math.min(woolAmountNum, woolAvailable),
      date: new Date().toISOString(), // Add date to the order
    };

    dispatch(placeCustomerOrder(order))
      .then(() => {
        if (order.milk === milkAmountNum && order.wool === woolAmountNum) {
          setSuccessMessage("Order placed successfully!");
          dispatch(addOrderToHistory(order)); // Add to order history
        } else {
          setPartialMessage("Partial order fulfilled!");
        }
      })
      .catch(() => setError("Order placement failed. Please try again."));
  };

  const handleMilkChange = (e) => {
    const value = e.target.value;
    if (value <= 1000) {
      setMilkAmount(value);
    }
    if (error) setError("");
  };

  const handleWoolChange = (e) => {
    const value = e.target.value;
    if (value <= 1000) {
      setWoolAmount(value);
    }
    if (error) setError("");
  };

  return (
    <div
      className={`order-form-container ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <Card
        className={`order-form-card ${darkMode ? "dark-mode" : "light-mode"}`}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Milk (liters)"
              type="number"
              fullWidth
              value={milkAmount}
              onChange={handleMilkChange}
              margin="normal"
              error={!!error && woolAmount === "" && milkAmount === ""}
              helperText={
                error && woolAmount === "" && milkAmount === ""
                  ? "Milk amount is required"
                  : ""
              }
              InputProps={{ inputProps: { max: 1000 } }}
            />
            <TextField
              label="Wool (skins)"
              type="number"
              fullWidth
              value={woolAmount}
              onChange={handleWoolChange}
              margin="normal"
              error={!!error && woolAmount === "" && milkAmount === ""}
              helperText={
                error && woolAmount === "" && milkAmount === ""
                  ? "Wool amount is required"
                  : ""
              }
              InputProps={{ inputProps: { max: 1000 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Place Order
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
              {successMessage}
            </Alert>
          )}
          {partialMessage && (
            <Alert severity="warning" sx={{ marginTop: 2 }}>
              {partialMessage}
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="order-history">
        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        <table>
          <thead>
            <tr>
              <th>Milk (liters)</th>
              <th>Wool (skins)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.length > 0 ? (
              orderHistory.map((order, index) => (
                <tr key={index}>
                  <td>{order.milk}</td>
                  <td>{order.wool}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No orders placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderForm;
