import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useVacationRequests } from "../context/VacationRequestsContext";
import RequestTable from "../components/RequestTable";
import RequestFormPopup from "../components/RequestFormPopup";

const RequesterDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { currentUser, logout } = useAuth();
  const { requests, isLoading, loadMyRequests, refresh } = useVacationRequests();

  useEffect(() => {
    if (currentUser) {
      loadMyRequests(currentUser.id);
    }
  }, [currentUser, loadMyRequests]);

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
      {isLoading ? (
        <p>Loading vacation requests...</p>
      ) : (
        <RequestTable requests={requests} />
      )}
      {isPopupOpen && (
        <RequestFormPopup
          onClose={() => setIsPopupOpen(false)}
          onSuccess={() => {
            setIsPopupOpen(false);
            if (currentUser) {
              refresh(currentUser.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default RequesterDashboard;
