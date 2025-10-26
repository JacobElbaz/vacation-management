import { BrowserRouter as Router, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import RequesterDashboard from "./pages/RequesterDashboard";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Requester Interface */}
          <Route
            path="/requester"
            element={
              <ProtectedRoute allowedRoles={["Requester"]}>
                <RequesterDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Validator Interface */}
          <Route
            path="/validator"
            element={
              <ProtectedRoute allowedRoles={["Validator"]}>
                <ValidatorDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
