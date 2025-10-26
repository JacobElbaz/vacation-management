import type { VacationRequest } from "../../types";
import TruncatedText from "../TruncatedText";

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
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.user_id}</td>
        <td>{request.start_date}</td>
        <td>{request.end_date}</td>
        <td>
          {request.reason ? (
            <TruncatedText text={request.reason} maxLength={30} />
          ) : (
            "-"
          )}
        </td>
        <td>
          <span
            className={`badge bg-${
              request.status === "Approved"
                ? "success"
                : request.status === "Rejected"
                ? "danger"
                : "warning"
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
              className={request.status === "Rejected" ? "text-danger" : ""}
            />
          ) : (
            "-"
          )}
        </td>
        <td className="d-flex gap-2">
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleApprove}
            disabled={request.status === "Approved"}
          >
            Approve
          </button>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={() => onReject(request.id)}
            disabled={request.status === "Rejected"}
          >
            Reject
          </button>
        </td>
      </tr>
  );
};

export default TableRow;
