import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useVacationRequests } from "../context/VacationRequestsContext";
import Table from "../components/validatorTable/Table";

const ValidatorDashboard = () => {
    const { currentUser, logout } = useAuth();
    const { requests, isLoading, loadAllRequests } = useVacationRequests();

    useEffect(() => {
        loadAllRequests();
    }, [loadAllRequests]);

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
            {isLoading ? (
                <p>Loading vacation requests...</p>
            ) : (
                <Table requests={requests} />
            )}
        </div>
    );
};

export default ValidatorDashboard;