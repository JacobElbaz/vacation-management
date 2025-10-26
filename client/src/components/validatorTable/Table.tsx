import { useState } from "react";
import type { VacationRequest } from "../../types";
import PopupReject from "../PopupReject";
import TableRow from "./TableRow";
import { useVacationRequests } from "../../context/VacationRequestsContext";
import { REQUEST_STATUS } from "../../constants";

interface Props {
  requests: VacationRequest[];
}

const Table = ({ requests }: Props) => {
  const [popupRejectIsOpen, setPopupRejectIsOpen] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const { updateRequestStatus, refresh } = useVacationRequests();
  
  const handleReject = (requestId: number) => {
    setRequestId(requestId);
    setPopupRejectIsOpen(true);
  };
  
  const handleApprove = async (requestId: number) => {
    try {
      await updateRequestStatus(requestId, { status: REQUEST_STATUS.APPROVED });
      await refresh();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };
  
  const handleRejectConfirm = async (requestId: number, comments: string) => {
    await updateRequestStatus(requestId, { 
      status: REQUEST_STATUS.REJECTED, 
      comments 
    });
    await refresh();
  };
  return (
    <>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="px-3">#</th>
                  <th scope="col">Employee ID</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Reason</th>
                  <th scope="col" className="text-center">Status</th>
                  <th scope="col">Comments</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests?.map((request) => (
                  <TableRow key={request.id} request={request} onReject={handleReject} onApprove={handleApprove} />
                ))}
                {requests?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
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
      {popupRejectIsOpen && (
        <PopupReject
          requestId={requestId ?? 0}
          onClose={() => setPopupRejectIsOpen(false)}
          onSuccess={() => {
            setPopupRejectIsOpen(false);
            refresh();
          }}
          onReject={handleRejectConfirm}
        />
      )}
    </>
  );
};

export default Table;
