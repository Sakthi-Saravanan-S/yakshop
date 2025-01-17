import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHerd } from "../store/stockSlice";
import { getOrderHistory } from "../store/orderSlice";
import "./StockDashboard.scss";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { calculateMilkProductionPerDay, calculateWoolStock } from "../utils";
import { format } from "date-fns";

const COLORS = ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56", "#7EC8E3"];

const StockDashboard = () => {
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.stock);
  const orderHistory = useSelector((state) => state.order.orderHistory);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [yakFilter, setYakFilter] = useState("");
  const [filteredHerd, setFilteredHerd] = useState(stock.herd);

  useEffect(() => {
    dispatch(getHerd());
    dispatch(getOrderHistory());
  }, [dispatch]);

  const filterData = () => {
    let filteredData = stock.herd;

    if (yakFilter) {
      filteredData = filteredData.filter((yak) => yak.name === yakFilter);
    }

    setFilteredHerd(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [yakFilter, stock.herd]);

  const totalOrderedMilk = orderHistory
    .filter((orderInfo) => orderInfo.orderStatus === "pending")
    .reduce((sum, orderInfo) => sum + orderInfo.milk, 0);

  const totalOrderedWool = orderHistory
    .filter((orderInfo) => orderInfo.orderStatus === "pending")
    .reduce((sum, orderInfo) => sum + orderInfo.wool, 0);

  const chartData = filteredHerd.map((yak) => {
    const ageInDays = yak.age * 100;

    return {
      name: yak.name,
      milk:
        calculateMilkProductionPerDay(ageInDays) -
        totalOrderedMilk / filteredHerd.length,
      wool:
        calculateWoolStock(ageInDays) - totalOrderedWool / filteredHerd.length,
    };
  });

  const milkPieData = chartData.map((yak) => ({
    name: yak.name,
    value: yak.milk,
  }));

  const woolPieData = chartData.map((yak) => ({
    name: yak.name,
    value: yak.wool,
  }));

  const totalMilk = stock.milkStock - totalOrderedMilk;
  const totalWool = stock.woolStock - totalOrderedWool;

  const aggregatedRevenueData = orderHistory.reduce((acc, order) => {
    const formattedDate = format(new Date(order.date), "yyyy-MM-dd");

    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        milkCost: 0,
        woolCost: 0,
        totalCost: 0,
      };
    }

    acc[formattedDate].milkCost += order.milkCost || 0;
    acc[formattedDate].woolCost += order.woolCost || 0;
    acc[formattedDate].totalCost += order.totalCost || 0;

    return acc;
  }, {});

  const revenueData = Object.values(aggregatedRevenueData);

  return (
    <div className={`stock-dashboard-container ${darkMode ? "dark" : ""}`}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 2,
          gap: 2,
          padding: "0 10px",
        }}
      >
        <FormControl fullWidth sx={{ maxWidth: "250px", minWidth: "200px" }}>
          <InputLabel id="yak-filter-label">Filter by Yak</InputLabel>
          <Select
            labelId="yak-filter-label"
            value={yakFilter}
            onChange={(e) => setYakFilter(e.target.value)}
            label="Filter by Yak"
            displayEmpty
            sx={{ paddingTop: "15px" }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                },
              },
            }}
          >
            <MenuItem value="">All Yaks</MenuItem>
            {stock.herd.map((yak) => (
              <MenuItem key={yak.id} value={yak.name}>
                {yak.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredHerd.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <div style={{ flex: "1 1 45%", padding: "10px" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontSize: "20px", fontWeight: "500", marginBottom: 2 }}
            >
              Milk Production Comparison (Liters)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={milkPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#4BC0C0"
                >
                  {milkPieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} Liters/Day`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 45%", padding: "10px" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontSize: "20px", fontWeight: "500", marginBottom: 2 }}
            >
              Wool Production Comparison (Skins)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={woolPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#FF6384"
                >
                  {woolPieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} Skins`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 100%", padding: "10px" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontSize: "20px", fontWeight: "500", marginBottom: 2 }}
            >
              Revenue Comparison (Milk, Wool, Total)
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value, name) => `₹${value}`}
                />
                <Line
                  type="monotone"
                  dataKey="milkCost"
                  stroke="#4BC0C0"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="woolCost"
                  stroke="#FF6384"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalCost"
                  stroke="#36A2EB"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 100%", padding: "10px" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontSize: "20px", fontWeight: "500", marginBottom: 2 }}
            >
              Overall Milk and Wool Stock Levels
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[{ name: "Total", milk: totalMilk, wool: totalWool }]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    `${value} ${name === "milk" ? "Liters/Day" : "Skins"}`
                  }
                />
                <Bar dataKey="milk" fill="#4BC0C0" barSize={120} />
                <Bar dataKey="wool" fill="#FF6384" barSize={120} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 100%", padding: "10px" }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ fontSize: "20px", fontWeight: "500", marginBottom: 2 }}
            >
              Milk vs Wool Production Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} margin={{ bottom: 30 }} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    `${value} ${name === "milk" ? "Liters/Day" : "Skins"}`
                  }
                />
                <Legend />
                <Bar dataKey="milk" fill="#4BC0C0" stackId="a" barSize={40} />
                <Bar dataKey="wool" fill="#FF6384" stackId="a" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p>No herd data available.</p>
      )}
    </div>
  );
};

export default StockDashboard;
