import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import RequesterDashboard from "./pages/RequesterDashboard";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/requester" />} />
        
        {/* Requester Interface */}
        <Route path="/requester" element={<RequesterDashboard />} />
        
        {/* Validator Interface */}
        <Route path="/validator" element={<ValidatorDashboard />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
