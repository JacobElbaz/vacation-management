import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import type { User } from "../types";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (currentUser) {
      if (currentUser.role === "Requester") {
        navigate("/requester");
      } else {
        navigate("/validator");
      }
      return;
    }
    
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    login(user);
  };

  const requesters = users.filter((user) => user.role === "Requester");
  const validators = users.filter((user) => user.role === "Validator");

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4">Vacation Management System</h1>
          <p className="lead">Select a user to continue</p>
        </div>
      </div>

      <div className="row">
        {/* Requesters Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                👤 Employees (Requester)
              </h3>
            </div>
            <div className="card-body">
              {requesters.length > 0 ? (
                <div className="list-group">
                  {requesters.map((user) => (
                    <button
                      key={user.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => handleUserSelect(user)}
                    >
                      <span className="fw-bold">{user.name}</span>
                      <span className="badge bg-primary rounded-pill">
                        Employee
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No employees available</p>
              )}
            </div>
          </div>
        </div>

        {/* Validators Section */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h3 className="card-title mb-0">
                👔 Managers (Validator)
              </h3>
            </div>
            <div className="card-body">
              {validators.length > 0 ? (
                <div className="list-group">
                  {validators.map((user) => (
                    <button
                      key={user.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => handleUserSelect(user)}
                    >
                      <span className="fw-bold">{user.name}</span>
                      <span className="badge bg-success rounded-pill">
                        Manager
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No managers available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

