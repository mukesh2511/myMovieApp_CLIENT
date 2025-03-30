import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("");

  const BASE_URL = "https://mymovieapp-api.onrender.com/api/movie";

  // Fetch Movies (READ)
  // Fetch Movies (READ)
  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/allmovies`, {
        params: { page, search: searchQuery, sort: sortOption },
      });
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching movies");
    }
    setLoading(false);
  };

  // Add a New Movie (CREATE)
  const addMovie = async (movieData) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/addmovie`, movieData);
      //console.log({ "after create": data });
      setMovies([...movies, data]);
      toast.success("Movie added successfully!");

      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding movie");
    }
  };

  // Update a Movie (UPDATE)
  const updateMovie = async (id, updatedData) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/editmovie/${id}`,
        updatedData
      );
      setMovies(movies.map((movie) => (movie._id === id ? data : movie)));
      toast.success("Movie updated successfully!");
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message || "Error updating movie");
    }
  };

  // Delete a Movie (DELETE)
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deletemovie/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id));
      toast.success("Movie deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting movie");
    }
  };

  // Fetch movies when component mounts or searchQuery changes
  useEffect(() => {
    fetchMovies();
  }, [searchQuery, sortOption]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        fetchMovies,
        searchQuery,
        setSearchQuery,
        addMovie,
        updateMovie,
        deleteMovie,
        loading,
        totalPages,
        setSortOption,
        sortOption,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
