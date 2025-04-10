import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useMovies } from "../context/movieContext";
import { useAuth } from "../context/authContext";
import uploadCloudinary from "../utils/uploadCloudinary";

const addMovie = () => {
  const { addMovie } = useMovies();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.isAdmin === false || !user) {
    toast.error("You are not authorized to add movies.");
    navigate("/");
  }

  const [movie, setMovie] = useState({
    title: "",
    release_date: "",
    overview: "",
    popularity: "",
    poster_path: "",
    rating: "",
    vote_average: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  //console.log({ movie });

  // useEffect(() => {
  //   const fetchMovieDetails = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(
  //         `http://localhost:5000/api/movie/getmovie/${id}`,
  //         { withCredentials: true }
  //       );
  //       console.log(res.data);
  //       if (res.data) {
  //         setMovie({
  //           title: res.data.title,
  //           release_date: res.data.release_date.split("T")[0],
  //           overview: res.data.overview,
  //           popularity: res.data.popularity,
  //           poster_path: res.data.poster_path,
  //         });
  //         toast.success("Movie details fetched successfully!");
  //       } else {
  //         toast.error("Movie not found.");
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Failed to fetch movie details.");
  //       setLoading(false);
  //     }
  //   };
  //   fetchMovieDetails();
  // }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUploading(true);

    const formData = new FormData();
    formData.append("poster", file);
    await axios.post(
      "https://mymovieapp-api.onrender.com/api/movie/deleteposter",
      {
        poster_path: movie.poster_path,
      }
    );

    try {
      // const { data } = await axios.post(
      //   "https://mymovieapp-api.onrender.com/api/movie/upload",
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );
      const cover = await uploadCloudinary(file);
      console.log(cover);
      setMovie((prev) => ({
        ...prev,
        poster_path: cover, // Save the uploaded image URL
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setImageUploading(false); // Stop loading
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("creating movie...");
      movie.vote_average = movie.rating;

      const newmovie = await addMovie(movie);
      //console.log({ newMovie: newmovie });

      toast.dismiss(); // Remove loading toast
      toast.success("Movie created successfully!");

      setTimeout(() => navigate(`/viewmovie/${newmovie._id}`), 2000); // Redirect after success
    } catch (error) {
      toast.dismiss();
      console.error("Error creating movie:", error);
      toast.error("Failed to create movie details!");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 5, mb: 6 }}>
      <Toaster />
      <Typography variant="h4" gutterBottom>
        Add Movie Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={movie.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Release Date"
              name="release_date"
              type="date"
              value={movie.release_date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Overview"
              name="overview"
              value={movie.overview}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Popularity"
              name="popularity"
              type="number"
              value={movie.popularity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rating 0-10"
              name="rating"
              type="number"
              min={0}
              max={10}
              value={movie.rating}
              onChange={handleChange}
              placeholder="0-10"
              required
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="center">
            <Box
              component="img"
              // src={
              //   movie?.poster_path?.startsWith("public")
              //     ? `https://mymovieapp-api.onrender.com/${movie?.poster_path?.replace(
              //         /\\/g,
              //         "/"
              //       )}` // Local image
              //     : `https://image.tmdb.org/t/p/w500${movie?.poster_path}` // TMDB image
              // }
              src={
                movie.poster_path.startsWith("http")
                  ? `${movie.poster_path}` // Local image
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}` // TMDB image
              }
              alt="Movie Poster"
              sx={{
                width: "100%",
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: 3,
                height: 300,
              }}
            />
          </Grid>
          <Box>
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              {imageUploading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Change Poster"
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {movie?.poster_path && (
              <Typography variant="body2">
                Selected: {movie?.poster_path?.name}
              </Typography>
            )}
          </Box>

          <Grid item xs={12} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ height: "50px" }}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default addMovie;
