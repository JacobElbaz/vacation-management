import { useState } from "react";
import type { VacationRequest } from "../../types";
import PopupReject from "../PopupReject";
import TableRow from "./TableRow";
import { useVacationRequests } from "../../context/VacationRequestsContext";

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
      await updateRequestStatus(requestId, { status: "Approved" });
      await refresh();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };
  
  const handleRejectConfirm = async (requestId: number, comments: string) => {
    await updateRequestStatus(requestId, { 
      status: "Rejected", 
      comments 
    });
    await refresh();
  };
  return (
    <>
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Employee ID</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests?.map((request) => (
          <TableRow key={request.id} request={request} onReject={handleReject} onApprove={handleApprove} />
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
