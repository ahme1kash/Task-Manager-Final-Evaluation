import React, { useState, useEffect } from "react";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Link,
} from "react-router-dom";
import LoginSignup from "./Components/LoginSignUp/LoginSignUp.jsx";
import invalid from "./assets/invalid.png";
import Home from "./Components/Home/Home.jsx";
import Analytics from "./Components/Analytics/Analytics.jsx";
import Settings from "./Components/Settings/Settings.jsx";
import Structure from "./Components/Structure/Structure.jsx";
import PrivateRoutes from "./Components/Helper/PrivateRoutes.jsx";
import LoaderComponent from "./Components/Loader/Loader.jsx";

const LoadingWrapper = ({ router }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [router]);

  return loading ? <LoaderComponent /> : <RouterProvider router={router} />;
};

const App = () => {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <LoginSignup />,
    },
    {
      element: <PrivateRoutes />,
      children: [
        {
          path: "/",
          element: <Structure />,
          children: [
            {
              path: "/home",
              element: <Home />,
            },
            {
              path: "/home/analytics",
              element: <Analytics />,
            },
            {
              path: "/home/settings",
              element: <Settings />,
            },
            {
              path: "/home/*",
              element: (
                <span style={{ fontSize: "small" }}>
                  <img
                    src={invalid}
                    style={{
                      width: "600px",
                      height: "410px",
                      margin: "1.5em auto",
                    }}
                    alt="Not Found"
                  />
                  <h1 style={{ color: "gray" }}>OOPS! NO SIMILAR ROUTES</h1>
                  <br />
                  <Link
                    style={{
                      cursor: "pointer",
                      color: "gray",
                      textDecoration: "none",
                      fontSize: "1.2em",
                    }}
                    to={"/home"}
                  >
                    Back To home
                  </Link>
                </span>
              ),
            },
            {
              path: "*",
              element: <Navigate to="/home" />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <LoadingWrapper router={route} />
    </div>
  );
};

export default App;
