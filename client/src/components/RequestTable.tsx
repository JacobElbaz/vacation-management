import type { VacationRequest } from "../types";
import TruncatedText from "./TruncatedText";

interface Props {
  requests: VacationRequest[];
}

const RequestTable = ({ requests }: Props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        {requests?.map((request) => (
          <tr key={request.id}>
            <td>{request.id}</td>
            <td>{request.start_date}</td>
            <td>{request.end_date}</td>
            <td>
              {request.reason ? (
                <TruncatedText text={request.reason} maxLength={40} />
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
                  maxLength={40}
                  className={request.status === "Rejected" ? "text-danger" : ""}
                />
              ) : (
                "-"
              )}
            </td>
          </tr>
        ))}
        {requests?.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center">
              No vacation requests found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RequestTable;
