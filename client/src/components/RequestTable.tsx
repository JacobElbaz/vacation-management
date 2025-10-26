import type { VacationRequest } from "../types";

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
        </tr>
      </thead>
      <tbody>
        {requests?.map((request) => (
          <tr key={request.id}>
            <td>{request.id}</td>
            <td>{request.start_date}</td>
            <td>{request.end_date}</td>
            <td>{request.reason || "-"}</td>
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
          </tr>
        ))}
        {requests?.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center">
              No vacation requests found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RequestTable;
