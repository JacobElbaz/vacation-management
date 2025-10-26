import { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { User } from "../types";

interface RequestFormPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const RequestFormPopup = ({ onClose, onSuccess }: RequestFormPopupProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      toast.error("User not found. Please select a user from the home page.");
      return;
    }
    const currentUser: User = JSON.parse(currentUserStr);

    setIsLoading(true);
    try {
      await api.post("/vacations", {
        user_id: currentUser.id,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      });
      toast.success("Vacation request submitted successfully");
      // Reset form
      setStartDate("");
      setEndDate("");
      setReason("");
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error submitting vacation request");
      } else {
        toast.error("Error submitting vacation request");
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className="modal show"
      style={{ display: "block" }}
    >
      <div className="modal-backdrop show" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1050 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="requestFormPopupLabel">
              Request Form
            </h5>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  className="form-control"
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFormPopup;
