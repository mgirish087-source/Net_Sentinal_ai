import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const location = useLocation();

  /* =========================================================
     TOKEN VALIDATION
  ========================================================= */

  const token = localStorage.getItem("token");

  const isAuthenticated =
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== "";

  /* =========================================================
     REDIRECT IF NOT AUTHENTICATED
  ========================================================= */

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* =========================================================
     AUTHORIZED
  ========================================================= */

  return children;
}