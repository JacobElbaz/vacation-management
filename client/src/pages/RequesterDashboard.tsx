import { useState } from "react";
import RequestTable from "../components/RequestTable";
import RequestFormPopup from "../components/RequestFormPopup";

const RequesterDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  return (
    <div className="container mt-5">
      <h1>Requester Dashboard</h1>
      <p>Welcome to the Requester Dashboard</p>
      <button
        type="button"
        className="btn btn-primary"
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
