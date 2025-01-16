import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/NavBar";
import HerdManagement from "./pages/HerdManagement";
import StockDashboard from "./pages/StockDashboard";
import OrderForm from "./pages/OrderForm";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#e0e0e0" : "#050a30",
      },
      background: {
        default: darkMode ? "#121212" : "#f7f7f7",
      },
      text: {
        primary: darkMode ? "#fff" : "#000",
      },
      link: {
        color: darkMode ? "#7ec8e3" : "#050a30",
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: darkMode ? "#fff" : "#000",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: darkMode ? "#7ec8e3" : "#050a30",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HerdManagement />} />
            <Route path="/herd" element={<HerdManagement />} />
            <Route path="/stock" element={<StockDashboard />} />
            <Route path="/order" element={<OrderForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
