import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RequestTable from "../components/RequestTable";
import RequestFormPopup from "../components/RequestFormPopup";

const RequesterDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Employee Dashboard</h1>
          <p className="text-muted">Welcome, {currentUser.name}!</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary mb-4"
        onClick={() => setIsPopupOpen(true)}
      >
        Submit Vacation Request
      </button>
      <RequestTable requests={[]} />
      {isPopupOpen && (
        <RequestFormPopup onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default RequesterDashboard;
