import type { VacationRequest } from "../../types";
import TruncatedText from "../TruncatedText";
import { REQUEST_STATUS } from "../../constants";

interface TableRowProps {
  request: VacationRequest;
  onReject: (requestId: number) => void;
  onApprove: (requestId: number) => void;
}

const TableRow = ({ request, onReject, onApprove }: TableRowProps) => {
  const handleApprove = async () => {
    await onApprove(request.id);
  };
  return (
    <tr>
      <td className="fw-bold px-3">{request.id}</td>
      <td>
        <span className="badge bg-info text-white">👤 #{request.user_id}</span>
      </td>
      <td>
        <span className="badge bg-light text-dark">
          📅 {request.start_date}
        </span>
      </td>
      <td>
        <span className="badge bg-light text-dark">
          📅 {request.end_date}
        </span>
      </td>
      <td>
        {request.reason ? (
          <TruncatedText text={request.reason} maxLength={30} />
        ) : (
          <span className="text-muted fst-italic">No reason</span>
        )}
      </td>
      <td className="text-center">
        <span
          className={`badge fs-6 px-3 py-2 ${
            request.status === REQUEST_STATUS.APPROVED
              ? "bg-success"
              : request.status === REQUEST_STATUS.REJECTED
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {request.status}
        </span>
      </td>
      <td>
        {request.comments ? (
          <TruncatedText 
            text={request.comments} 
            maxLength={30}
            className={request.status === REQUEST_STATUS.REJECTED ? "text-danger fw-bold" : "text-muted"}
          />
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
      <td className="text-center">
        <div className="d-flex gap-2 justify-content-center">
          <button 
            className="btn btn-success btn-sm" 
            onClick={handleApprove}
            disabled={request.status === REQUEST_STATUS.APPROVED}
            title="Approve request"
          >
            ✓ Approve
          </button>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={() => onReject(request.id)}
            disabled={request.status === REQUEST_STATUS.REJECTED}
            title="Reject request"
          >
            ✕ Reject
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
