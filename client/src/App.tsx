import { BrowserRouter as Router, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { VacationRequestsProvider } from "./context/VacationRequestsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import RequesterDashboard from "./pages/RequesterDashboard";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <VacationRequestsProvider>
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
          </VacationRequestsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
