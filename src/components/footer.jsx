import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        py: 1,
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Container>
        {/* Social Media Links */}
        <Box sx={{ mb: 1 }}>
          <IconButton
            href="https://facebook.com"
            target="_blank"
            color="inherit"
          >
            <Facebook />
          </IconButton>
          <IconButton
            href="https://twitter.com"
            target="_blank"
            color="inherit"
          >
            <Twitter />
          </IconButton>
          <IconButton
            href="https://instagram.com"
            target="_blank"
            color="inherit"
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>
        </Box>

        {/* Copyright Info */}
        <Typography variant="body2">
          © {new Date().getFullYear()} MyMovieApp. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
