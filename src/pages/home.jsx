import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Pagination,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  Star,
  StarBorder,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { useMovies } from "../context/movieContext.jsx";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const { movies, fetchMovies, deleteMovie, loading, totalPages, searchQuery } =
    useMovies();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [likedMovies, setLikedMovies] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies(page);
  }, [page, searchQuery]); // Trigger fetch when page or search query changes

  const handlePageChange = (event, value) => {
    setPage(value); // Update page state
  };

  const toggleLike = (movieID) => {
    setLikedMovies((prevLikedMovies) => {
      const newLikedMovies = new Set(prevLikedMovies);
      if (newLikedMovies.has(movieID)) {
        newLikedMovies.delete(movieID);
      } else {
        newLikedMovies.add(movieID);
      }
      return newLikedMovies;
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      toast.success("Movie deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating / 2);
    return (
      <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
        {[...Array(5)].map((_, i) =>
          i < fullStars ? (
            <Star key={i} color="primary" />
          ) : (
            <StarBorder key={i} color="primary" />
          )
        )}
        <Typography variant="body2" ml={1}>
          {rating.toFixed(1)}/10
        </Typography>
      </Box>
    );
  };

  return (
    <Container sx={{ mt: 10, py: 3, mb: 6 }}>
      <Toaster />
      <Typography variant="h4" align="center" gutterBottom>
        Movie Collection
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {movies.map((movie) => (
            <Grid
              sx={{
                gridColumn: {
                  xs: "span 12",
                  sm: "span 6",
                  md: "span 4",
                  lg: "span 3",
                },
              }}
              key={movie._id}
            >
              <Card
                sx={{
                  maxWidth: 250,
                  minWidth: 250,
                  mx: "auto",
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={
                    movie.poster_path.startsWith("public")
                      ? `https://mymovieapp-api.onrender.com/${movie.poster_path.replace(
                          /\\/g,
                          "/"
                        )}` // Local image
                      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  }
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title.length > 20
                      ? `${movie.title.slice(0, 15)}...`
                      : movie.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {movie.overview.length > 50
                      ? `${movie.overview.slice(0, 50)}...`
                      : movie.overview}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Release Date: {movie.release_date.split("T")[0]}
                  </Typography>
                  {renderStarRating(movie.vote_average)}

                  <Box
                    mt={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <IconButton
                      color={likedMovies.has(movie._id) ? "error" : "default"}
                      onClick={() => toggleLike(movie._id)}
                    >
                      {likedMovies.has(movie._id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    {user?.isAdmin && (
                      <>
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/editmovie/${movie._id}`)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(movie._id)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/viewmovie/${movie._id}`)}
                  >
                    View Movie
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Pagination
        count={totalPages} // You should dynamically set this based on `total_pages` from API response
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default HomePage;
