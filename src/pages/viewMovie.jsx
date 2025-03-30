import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ViewMovie = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://mymovieapp-api.onrender.com/api/movie/getmovie/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setMovie(res.data);
          toast.success("Movie details fetched successfully!");
        } else {
          toast.error("Movie not found.");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch movie details.");
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  // Function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating / 2); // Convert 10-point scale to 5-star scale
    const starArray = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starArray.push(<Star key={i} color="primary" />);
      } else {
        starArray.push(<StarBorder key={i} color="primary" />);
      }
    }

    return (
      <Box display="flex" alignItems="center" mt={2}>
        <Typography variant="body1" mr={2}>
          Rating:
        </Typography>
        {starArray}
        <Typography variant="body2" ml={1}>
          {rating.toFixed(1)}/10
        </Typography>
      </Box>
    );
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 5 }}>
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container sx={{ mt: 5, mb: 8 }} maxWidth="lg">
      <Toaster />
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          flexDirection: { xs: "column", md: "row" }, // Changed to default column on mobile
          width: "100%",
        }}
      >
        {/* Left Side - Text Details */}
        <Grid
          sx={{
            gridColumn: { xs: "span 12", md: "span 6" },
            order: { xs: 2, md: 1 },
          }}
        >
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Release Date: {movie.release_date.split("T")[0]}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {movie.overview}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
            Popularity: {movie.popularity}
          </Typography>

          {/* Added Star Rating */}
          {renderStarRating(movie.vote_average)}
        </Grid>

        {/* Right Side - Movie Poster */}
        <Grid
          sx={{
            gridColumn: { xs: "span 12", md: "span 6" },
            order: { xs: 1, md: 2 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            // src={
            //   movie.poster_path.startsWith("public")
            //     ? `https://mymovieapp-api.onrender.com/${movie.poster_path.replace(
            //         /\\/g,
            //         "/"
            //       )}` // Local image
            //     : `https://image.tmdb.org/t/p/w500${movie.poster_path}` // TMDB image
            // }
            src={
              movie.poster_path.startsWith("http")
                ? `${movie.poster_path}` // Local image
                : `https://image.tmdb.org/t/p/w500${movie.poster_path}` // TMDB image
            }
            alt={movie.title}
            sx={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewMovie;
