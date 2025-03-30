import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import AddMovie from "./pages/addMovie.jsx";
import EditMovie from "./pages/editMovie.jsx";
import ViewMovie from "./pages/viewMovie.jsx";

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <div className="app">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/addmovie", element: <AddMovie /> },
      { path: "/editmovie/:id", element: <EditMovie /> },
      { path: "/viewmovie/:id", element: <ViewMovie /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

const App = () => {
  return (
    <div className="app-container ">
      <RouterProvider router={router} />;
    </div>
  );
};

export default App;
