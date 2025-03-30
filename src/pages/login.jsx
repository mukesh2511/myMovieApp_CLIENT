import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext.jsx";

const Login = () => {
  const [tab, setTab] = useState(0);
  const [toggle, setToggle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (tab === 0 && (!formData.email || !formData.password)) {
      toast.error("Please enter email and password");
      setLoading(false);
      return;
    }

    if (tab === 1 && !formData.email) {
      toast.error("Please enter email");
      setLoading(false);
      return;
    }

    try {
      if (tab === 0) {
        // Use context login method
        await login(formData);
        setLoading(false);
        toast.success("Logged in successfully!");
        navigate("/home");
      }
      if (tab === 1) {
        // Use context send OTP method
        await sendOtp(formData.email);
        setLoading(false);
        toast.success("OTP sent to your email!");
        setToggle(1);
      }
    } catch (error) {
      // Error handling is now done in the context
      console.error("Login error:", error);
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data || "Login failed");
      } else {
        toast.error("An error occurred during login");
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.otp) {
      toast.error("Please enter OTP");
      return;
    }
    try {
      // Use context verify OTP method
      await verifyOtp(formData);
      setLoading(false);
      toast.success("OTP verified successfully!");
      navigate("/home");
    } catch (error) {
      // Error handling is now done in the context
      console.error("OTP verification error:", error);
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data || "OTP verification failed");
      } else {
        toast.error("An error occurred during OTP verification");
      }
    }
  };

  return (
    <>
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
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              textAlign: "center",
              bgcolor: "rgba(0,0,0,0.8)",
              color: "#fff",
              width: "100%",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>

            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="Direct Login" sx={{ color: "#ff9800" }} />
              <Tab label="OTP Login" sx={{ color: "#ff9800" }} />
            </Tabs>

            <Box
              component="form"
              onSubmit={toggle === 0 ? handleSubmit : handleOtpSubmit}
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
              />

              {/* {tab === 0 ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
                />
              ) : (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="OTP Code"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
                />
              )} */}
              {tab === 0 && (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
                />
              )}
              {tab === 1 && toggle === 1 && (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="OTP Code"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
                />
              )}

              {toggle === 0 && (
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
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img src="/spinner.gif" alt="Loading" height="20px" />
                      <Box sx={{ ml: 1 }}>
                        {tab === 0 ? "Logging in..." : "Sending..."}
                      </Box>
                    </Box>
                  ) : tab === 0 ? (
                    "Login"
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              )}
              {toggle === 1 && (
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
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img src="/spinner.gif" alt="Loading" height="20px" />
                      <Box sx={{ ml: 1 }}>Verifying...</Box>
                    </Box>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              )}
            </Box>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: "#ff9800" }}>
                Sign Up
              </a>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;
