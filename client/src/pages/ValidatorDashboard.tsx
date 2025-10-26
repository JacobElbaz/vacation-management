import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { User } from "../types";

const ValidatorDashboard = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            navigate("/");
            return;
        }
        const user: User = JSON.parse(userStr);
        
        // Check if user has the correct role for this page
        if (user.role !== "Validator") {
            // Redirect to the appropriate dashboard based on role
            if (user.role === "Requester") {
                navigate("/requester");
            } else {
                navigate("/");
            }
            return;
        }
        
        setCurrentUser(user);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/");
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