import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Switch,
} from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";
import "./NavBar.scss";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar
      position="sticky"
      className={`navbar ${darkMode ? "dark" : "light"}`}
    >
      <Container>
        <Toolbar>
          <Typography
            onClick={handleLogoClick}
            variant="h6"
            component="div"
            className="logo"
          >
            YakShop
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Link to="/" className="link">
            <Button className="button">Herd Management</Button>
          </Link>
          <Link to="/stock" className="link">
            <Button className="button">Stock Dashboard</Button>
          </Link>
          <Link to="/order" className="link">
            <Button className="button">Order Form</Button>
          </Link>
          <Box className="dark-mode-toggle">
            <Switch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              inputProps={{ "aria-label": "dark mode toggle" }}
            />
            {darkMode ? (
              <FaSun size={24} color="#fff" />
            ) : (
              <FaMoon size={24} color="#000" />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
