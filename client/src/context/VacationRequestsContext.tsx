/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { VacationRequest } from "../types";
import { useAuth } from "./AuthContext";

interface SubmitRequestData {
  start_date: string;
  end_date: string;
  reason: string;
  user_id?: number; // Optional, will use currentUser.id if not provided
}

interface UpdateRequestStatusData {
  status: "Pending" | "Approved" | "Rejected";
  comments?: string;
  validatorId?: number; // Will be added automatically
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface VacationRequestsContextType {
  requests: VacationRequest[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  currentPage: number;
  statusFilter: string | null;
  submitRequest: (data: SubmitRequestData) => Promise<VacationRequest | null>;
  updateRequestStatus: (
    requestId: number,
    data: UpdateRequestStatusData
  ) => Promise<boolean>;
  loadMyRequests: () => Promise<void>; // No userId parameter - uses currentUser
  loadAllRequests: (page?: number, limit?: number, status?: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (status: string | null) => void;
  refresh: () => Promise<void>; // No userId parameter - uses currentUser
}

const VacationRequestsContext = createContext<
  VacationRequestsContextType | undefined
>(undefined);

export const VacationRequestsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Load vacation requests for the current user
  const loadMyRequests = useCallback(async () => {
    if (!currentUser) {
      toast.error("User not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/vacations/me", {
        params: { userId: currentUser.id },
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
  }, [currentUser]);

  // Load all vacation requests (for validators/managers)
  const loadAllRequests = useCallback(async (page?: number, limit?: number, status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (status) params.status = status;
      
      const response = await api.get("/vacations", { params });
      
      // Handle paginated response
      if (response.data.vacations) {
        setRequests(response.data.vacations);
        setPagination(response.data.pagination);
      } else {
        setRequests(response.data);
        setPagination(null);
      }
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
      if (!currentUser) {
        toast.error("User not found. Please log in again.");
        return null;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Add user_id from currentUser if not provided
        const requestData = {
          ...data,
          user_id: data.user_id || currentUser.id,
        };

        const response = await api.post("/vacations", requestData);
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
    [currentUser]
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
        // Get current user from AuthContext
        if (!currentUser) {
          toast.error("User not found. Please log in again.");
          return false;
        }
        
        // Add validatorId to the request
        const requestData = {
          ...data,
          validatorId: currentUser.id,
        };

        await api.patch(`/vacations/${requestId}`, requestData);
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
    [currentUser] // Add currentUser to dependencies
  );

  // Refresh the current list based on current user's role
  const refresh = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    // If user is a validator, load all requests; otherwise load my requests
    if (currentUser.role === "Validator") {
      await loadAllRequests(currentPage, 10, statusFilter || undefined);
    } else {
      await loadMyRequests();
    }
  }, [currentUser, loadMyRequests, loadAllRequests, currentPage, statusFilter]);

  // Handler for page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handler for status filter change
  const handleStatusFilterChange = useCallback((status: string | null) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  return (
    <VacationRequestsContext.Provider
      value={{
        requests,
        isLoading,
        error,
        pagination,
        currentPage,
        statusFilter,
        submitRequest,
        updateRequestStatus,
        loadMyRequests,
        loadAllRequests,
        setCurrentPage: handlePageChange,
        setStatusFilter: handleStatusFilterChange,
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
