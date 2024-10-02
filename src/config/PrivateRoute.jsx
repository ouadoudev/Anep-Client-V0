import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../auth/user-context";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const [currentUser] = useContext(UserContext);

  // console.log("Current user in PrivateRoute:", currentUser);

  if (!currentUser) {
    console.log("Redirecting to /Auth");
    return <Navigate to="/Auth" />;
  }

  return children;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
