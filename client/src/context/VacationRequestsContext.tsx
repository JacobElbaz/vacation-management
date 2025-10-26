/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { VacationRequest } from "../types";

interface SubmitRequestData {
  user_id: number;
  start_date: string;
  end_date: string;
  reason: string;
}

interface UpdateRequestStatusData {
  status: "Pending" | "Approved" | "Rejected";
  comments?: string;
}

interface VacationRequestsContextType {
  requests: VacationRequest[];
  isLoading: boolean;
  error: string | null;
  submitRequest: (data: SubmitRequestData) => Promise<VacationRequest | null>;
  updateRequestStatus: (
    requestId: number,
    data: UpdateRequestStatusData
  ) => Promise<boolean>;
  loadMyRequests: (userId: number) => Promise<void>;
  loadAllRequests: () => Promise<void>;
  refresh: (userId?: number) => Promise<void>;
}

const VacationRequestsContext = createContext<
  VacationRequestsContextType | undefined
>(undefined);

export const VacationRequestsProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load vacation requests for a specific user
  const loadMyRequests = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/vacations/me", {
        params: { userId },
      });
      setRequests(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to load vacation requests"
          : "Failed to load vacation requests";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load all vacation requests (for validators/managers)
  const loadAllRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/vacations");
      setRequests(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to load vacation requests"
          : "Failed to load vacation requests";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit a new vacation request
  const submitRequest = useCallback(
    async (data: SubmitRequestData): Promise<VacationRequest | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post("/vacations", data);
        const newRequest = response.data;
        setRequests((prev) => [...prev, newRequest]);
        toast.success("Vacation request submitted successfully");
        return newRequest;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Failed to submit request"
            : "Failed to submit request";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update request status (approve/reject) - for validators
  const updateRequestStatus = useCallback(
    async (
      requestId: number,
      data: UpdateRequestStatusData
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await api.patch(`/vacations/${requestId}`, data);
        setRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? { ...request, status: data.status }
              : request
          )
        );
        toast.success("Request status updated successfully");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Failed to update status"
            : "Failed to update status";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh the current list
  const refresh = useCallback(
    async (userId?: number) => {
      if (userId !== undefined) {
        await loadMyRequests(userId);
      } else {
        await loadAllRequests();
      }
    },
    [loadMyRequests, loadAllRequests]
  );

  return (
    <VacationRequestsContext.Provider
      value={{
        requests,
        isLoading,
        error,
        submitRequest,
        updateRequestStatus,
        loadMyRequests,
        loadAllRequests,
        refresh,
      }}
    >
      {children}
    </VacationRequestsContext.Provider>
  );
};

export const useVacationRequests = () => {
  const context = useContext(VacationRequestsContext);
  if (context === undefined) {
    throw new Error(
      "useVacationRequests must be used within a VacationRequestsProvider"
    );
  }
  return context;
};
