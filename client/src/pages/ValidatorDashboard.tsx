import { useAuth } from "../context/AuthContext";

const ValidatorDashboard = () => {
    const { currentUser, logout } = useAuth();

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
            <p className="lead">Coming soon: vacation request validation</p>
        </div>
    );
};

export default ValidatorDashboard;