import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Removed unnecessary initial loading state

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://mymovieapp-api.onrender.com/api/auth/verifytoken",
        { withCredentials: true }
      );

      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // If unauthorized or error, clear the state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login with credentials
  const login = async (formData) => {
    try {
      const res = await axios.post(
        "https://mymovieapp-api.onrender.com/api/auth/login",
        formData,
        { withCredentials: true }
      );
      //console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      toast.success("Logged in Successfully ⭐");
      //console.log(res.data);
      return res.data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      if (error.response) {
        toast.error(error.response.data || "Login failed");
      } else {
        toast.error("An error occurred during login");
      }

      throw error;
    }
  };

  // OTP Login
  const sendOtp = async (email) => {
    try {
      const sendOtp = await axios.post(
        "https://mymovieapp-api.onrender.com/api/auth/sendotp",
        { email }
      );

      toast.success("OTP sent to your email!");
      return sendOtp.data;
    } catch (error) {
      toast.error(error.response?.data || "Failed to send OTP");
      throw error;
    }
  };

  // Verify OTP
  const verifyOtp = async (formData) => {
    try {
      const res = await axios.post(
        "https://mymovieapp-api.onrender.com/api/auth/verifyotp",
        formData,
        {
          withCredentials: true, // Ensures cookies are sent and stored
        }
      );

      //console.log({ verifyOtp: res.data });
      setUser(res.data);
      setIsAuthenticated(true);
      toast.success("OTP verified successfully ⭐");
      return res.data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      if (error.response) {
        toast.error(error.response.data || "OTP verification failed");
      } else {
        toast.error("An error occurred during OTP verification");
      }

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        "https://mymovieapp-api.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    login,
    sendOtp,
    verifyOtp,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
