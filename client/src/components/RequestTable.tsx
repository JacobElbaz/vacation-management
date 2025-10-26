import type { VacationRequest } from "../types";
import TruncatedText from "./TruncatedText";
import { REQUEST_STATUS } from "../constants";

interface Props {
  requests: VacationRequest[];
}

const RequestTable = ({ requests }: Props) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="px-3">#</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Reason</th>
                <th scope="col" className="text-center">Status</th>
                <th scope="col">Comments</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((request) => (
                <tr key={request.id}>
                  <td className="fw-bold px-3">{request.id}</td>
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
                      <TruncatedText text={request.reason} maxLength={40} />
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
                        maxLength={40}
                        className={request.status === REQUEST_STATUS.REJECTED ? "text-danger fw-bold" : "text-muted"}
                      />
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="text-muted">
                      <p className="fs-4">📭</p>
                      <p className="mb-0">No vacation requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestTable;
