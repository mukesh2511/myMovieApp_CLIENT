import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  InputBase,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { useMovies } from "../context/movieContext";
import { useLocation } from "react-router-dom";

// Styled components for search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(3), width: "auto" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: { width: "20ch" },
  },
}));

const Navbar = () => {
  const { pathname } = useLocation();
  //console.log(pathname);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { searchQuery, setSearchQuery } = useMovies("");
  //console.log({ searchQuery });
  // const [searchQuery, setSearchQuery] = useState("");
  const { sortOption, setSortOption } = useMovies("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    //console.log("Sort option changed:", e.target.value);
    setSortOption(e.target.value);
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function from context

    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MyMovieApp
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user.isAdmin && (
                <Button color="inherit" onClick={() => navigate("/addmovie")}>
                  Add Movie
                </Button>
              )}
              <IconButton color="inherit">
                <AccountCircle />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {user.username.split(" ")[0].toUpperCase()}
                </Typography>
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Secondary Toolbar for Search & Sort */}
      {!/^\/viewmovie\/[^/]+$/.test(pathname) &&
        !/^\/editmovie\/[^/]+$/.test(pathname) &&
        pathname !== "/addmovie" && (
          <AppBar
            position="fixed"
            color="default"
            sx={{ bgcolor: "#333", top: 64 }}
          >
            <Toolbar>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search by title or description…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Search>
              <Box sx={{ minWidth: 120, ml: 2 }}>
                <Select
                  displayEmpty
                  value={sortOption}
                  onChange={handleSortChange}
                  sx={{ color: "#fff" }}
                  inputProps={{ "aria-label": "Sort" }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="releaseDate">Release Date</MenuItem>
                </Select>
              </Box>
            </Toolbar>
          </AppBar>
        )}

      {/* Ensure content starts below navbar */}
      <Container sx={{ marginTop: "128px" }}>
        {" "}
        {/* Adjust marginTop based on navbar height */}
        {/* Your main content goes here */}
      </Container>
    </>
  );
};

export default Navbar;
