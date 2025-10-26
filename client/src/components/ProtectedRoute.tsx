import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"Requester" | "Validator">;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuth();

  // If no roles specified, just check authentication
  if (allowedRoles === undefined) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === "Requester") {
      return <Navigate to="/requester" replace />;
    } else {
      return <Navigate to="/validator" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

