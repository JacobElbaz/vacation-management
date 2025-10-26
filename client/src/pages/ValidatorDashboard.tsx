import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useVacationRequests } from "../context/VacationRequestsContext";
import Table from "../components/validatorTable/Table";
import Pagination from "../components/Pagination";

const ValidatorDashboard = () => {
    const { currentUser, logout } = useAuth();
    const { 
        requests, 
        isLoading, 
        loadAllRequests,
        pagination,
        currentPage,
        statusFilter,
        setCurrentPage,
        setStatusFilter 
    } = useVacationRequests();

    useEffect(() => {
        loadAllRequests(currentPage, 10, statusFilter || undefined);
    }, [loadAllRequests, currentPage, statusFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setStatusFilter(value === "all" ? null : value);
    };

    const handleLogout = () => {
        logout();
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Manager Dashboard</h1>
                    <p className="text-muted">Welcome, {currentUser.name}!</p>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            
            {/* Status Filter */}
            <div className="mb-3">
                <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
                <select
                    id="statusFilter"
                    className="form-select"
                    style={{ maxWidth: "200px" }}
                    value={statusFilter || "all"}
                    onChange={handleStatusChange}
                >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {isLoading ? (
                <p>Loading vacation requests...</p>
            ) : (
                <>
                    <Table requests={requests} />
                    {pagination && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={pagination.itemsPerPage}
                            totalItems={pagination.totalItems}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ValidatorDashboard;