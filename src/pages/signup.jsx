import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setError("Password must be at least 6 characters long");
      return;
    }
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      setError("Please fill all fields");
      return;
    }
    if (formData.username.length < 3) {
      toast.error("Name must be at least 3 characters long");
      setError("Name must be at least 3 characters long");
      return;
    }

    try {
      const res = await axios.post(
        "https://mymovieapp-api.onrender.com/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Registered Successfully ⭐");
      setError("");
      //console.log("User signed up:", res.data);
      navigate("/login");
    } catch (error) {
      //console.log("Error signing up:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data || "An error occurred");
        setError(error.response.data || "An error occurred");
      } else {
        toast.error("Something went wrong");
        setError("Something went wrong");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Toaster />
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            textAlign: "center",
            bgcolor: "rgba(0,0,0,0.9)",
            color: "#fff",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Full Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#ff9800",
                "&:hover": { bgcolor: "#e68900" },
              }}
            >
              Sign Up
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Typography
              component="span" // Fix: Change to span
              sx={{ color: "#ff9800", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
