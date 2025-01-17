import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  placeCustomerOrder,
  addOrderToHistory,
  getOrderHistory,
} from "../store/orderSlice";
import { getHerd } from "../store/stockSlice";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { FaRupeeSign, FaInfoCircle } from "react-icons/fa";
import CustomTable from "../components/CustomTable";
import "./OrderForm.scss";

const OrderForm = () => {
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.stock);
  const orderHistory = useSelector((state) => state.order?.orderHistory || []);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [formState, setFormState] = useState({
    milkAmount: "",
    woolAmount: "",
    error: "",
    successMessage: "",
    partialMessage: "",
    milkCost: 0,
    woolCost: 0,
    totalCost: 0,
  });

  const MILK_COST_PER_LITER = 30;
  const WOOL_COST_PER_SKIN = 500;

  useEffect(() => {
    dispatch(getHerd());
    dispatch(getOrderHistory());
  }, [dispatch]);

  useEffect(() => {
    const { milkAmount, woolAmount } = formState;
    const milkCost = milkAmount
      ? parseInt(milkAmount, 10) * MILK_COST_PER_LITER
      : 0;
    const woolCost = woolAmount
      ? parseInt(woolAmount, 10) * WOOL_COST_PER_SKIN
      : 0;
    setFormState((prevState) => ({
      ...prevState,
      milkCost,
      woolCost,
      totalCost: milkCost + woolCost,
    }));
  }, [formState.milkAmount, formState.woolAmount]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (value >= 0 && value <= 1000) {
      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
        error: "",
      }));
    }
  };

  const validateOrder = () => {
    const { milkAmount, woolAmount } = formState;
    const milkAmountNum = parseInt(milkAmount, 10);
    const woolAmountNum = parseInt(woolAmount, 10);

    if (isNaN(milkAmountNum) && isNaN(woolAmountNum)) {
      return "Either milk or wool amount is required.";
    }

    if (
      (milkAmount && (isNaN(milkAmountNum) || milkAmountNum < 0)) ||
      (woolAmount && (isNaN(woolAmountNum) || woolAmountNum < 0))
    ) {
      return "Please enter valid positive numbers for milk and wool.";
    }

    const milkAvailable = stock.milkStock;
    const woolAvailable = stock.woolStock;

    if (milkAmountNum > milkAvailable && woolAmountNum > woolAvailable) {
      return "Insufficient stock for both milk and wool.";
    } else if (milkAmountNum > milkAvailable) {
      return "Insufficient stock for milk.";
    } else if (woolAmountNum > woolAvailable) {
      return "Insufficient stock for wool.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateOrder();
    if (validationError) {
      setFormState((prevState) => ({ ...prevState, error: validationError }));
      return;
    }

    const { milkAmount, woolAmount } = formState;
    const milkAmountNum = milkAmount ? parseInt(milkAmount, 10) : 0;
    const woolAmountNum = woolAmount ? parseInt(woolAmount, 10) : 0;

    const milkCost = milkAmountNum * MILK_COST_PER_LITER;
    const woolCost = woolAmountNum * WOOL_COST_PER_SKIN;

    const order = {
      milk: Math.min(milkAmountNum, stock.milkStock),
      wool: Math.min(woolAmountNum, stock.woolStock),
      milkCost,
      woolCost,
      totalCost: milkCost + woolCost,
      date: new Date().toISOString(),
      id: Math.floor(100000 + Math.random() * 900000),
      orderStatus: "pending",
    };

    dispatch(placeCustomerOrder(order))
      .then(() => {
        if (order.milk === milkAmountNum && order.wool === woolAmountNum) {
          setFormState((prevState) => ({
            ...prevState,
            successMessage: "Order placed successfully!",
            milkAmount: "",
            woolAmount: "",
          }));
          dispatch(addOrderToHistory(order));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            partialMessage: "Partial order fulfilled!",
          }));
        }
      })
      .catch(() =>
        setFormState((prevState) => ({
          ...prevState,
          error: "Order placement failed. Please try again.",
        }))
      );
  };

  const {
    milkAmount,
    woolAmount,
    error,
    successMessage,
    partialMessage,
    totalCost,
    milkCost,
    woolCost,
  } = formState;

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
              onChange={(e) => handleInputChange(e, "milkAmount")}
              margin="normal"
              error={!!error && woolAmount === "" && milkAmount === ""}
              helperText={
                error && woolAmount === "" && milkAmount === ""
                  ? "Milk amount is required"
                  : ""
              }
              InputProps={{ inputProps: { max: 1000 } }}
            />
            <div className="info-icon-container">
              <Tooltip title="Enter the amount of milk you want to order.">
                <FaInfoCircle className="info-icon" />
              </Tooltip>
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
              >
                1L of milk is <FaRupeeSign />
                {MILK_COST_PER_LITER}
              </Typography>
            </div>

            <TextField
              label="Wool (skins)"
              type="number"
              fullWidth
              value={woolAmount}
              onChange={(e) => handleInputChange(e, "woolAmount")}
              margin="normal"
              error={!!error && woolAmount === "" && milkAmount === ""}
              helperText={
                error && woolAmount === "" && milkAmount === ""
                  ? "Wool amount is required"
                  : ""
              }
              InputProps={{ inputProps: { max: 1000 } }}
            />
            <div className="info-icon-container">
              <Tooltip title="Enter the amount of wool you want to order.">
                <FaInfoCircle className="info-icon" />
              </Tooltip>
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
              >
                1 skin of wool is <FaRupeeSign />
                {WOOL_COST_PER_SKIN}
              </Typography>
            </div>
            <div className="cost-section">
              <div className="milk-cost">
                <Typography variant="p" sx={{ marginTop: 1 }}>
                  Cost of Milk
                </Typography>
                <Typography variant="p" sx={{ marginTop: 1 }}>
                  <FaRupeeSign />
                  {milkCost}
                </Typography>
              </div>
              <div className="wool-cost">
                <Typography variant="p" sx={{ marginTop: 1 }}>
                  Cost of Wool
                </Typography>
                <Typography variant="p" sx={{ marginTop: 1 }}>
                  <FaRupeeSign />
                  {woolCost}
                </Typography>
              </div>
              <hr />
              <div className="total-cost">
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  Total Cost
                </Typography>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  <FaRupeeSign />
                  {totalCost}
                </Typography>
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Place Order
              </Button>
            </div>
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
        <Typography variant="h5" gutterBottom>
          Order History
        </Typography>
        {orderHistory.length > 0 ? (
          <CustomTable
            rows={orderHistory.map((order) => ({
              id: `#${order.id}`,
              milk: `${order.milk}L`,
              wool: order.wool,
              totalCost: `₹${order.totalCost}`,
              date: new Date(order.date).toLocaleString(),
              orderId: order.orderId,
              orderStatus: order.orderStatus,
            }))}
            columns={[
              {
                field: "id",
                headerName: "Order ID",
                width: 150,
                resizable: false,
              },
              {
                field: "date",
                headerName: "Date",
                width: 250,
                resizable: false,
              },
              {
                field: "milk",
                headerName: "Milk (liters)",
                width: 150,
                align: "right",
                resizable: false,
              },
              {
                field: "wool",
                headerName: "Wool (skins)",
                width: 150,
                align: "right",
                resizable: false,
              },
              {
                field: "totalCost",
                headerName: "Total Cost",
                width: 150,
                align: "right",
                resizable: false,
              },
              {
                field: "orderStatus",
                headerName: "Order Status",
                width: 200,
                resizable: false,
              },
            ]}
            darkMode={darkMode}
          />
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            No orders placed yet.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
