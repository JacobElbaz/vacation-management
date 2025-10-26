import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  requestId: number;
  onClose: () => void;
  onSuccess: () => void;
  onReject: (requestId: number, comments: string) => Promise<void>;
}

const PopupReject = ({ requestId, onClose, onSuccess, onReject }: Props) => {
  const [comments, setComments] = useState("");
  
  const handleClose = () => {
    onClose();
  };
  
  const handleReject = async () => {
    try {
      await onReject(requestId, comments);
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject request";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-backdrop show" onClick={onClose}></div>
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="popupRejectLabel">
              Reject Vacation Request
            </h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to reject this vacation request?</p>
            <p>Reason (optional):</p>
            <textarea
              className="form-control"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleReject}>
              Yes, reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupReject;
