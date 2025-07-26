import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return 
    (
      <div className="flex justify-center items-center h-screen">
       <Loader></Loader>
      </div>
    )
    ;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // pass the current location
      />
    );
  }

  return children;
};

export default PrivateRoute;
