import { BrowserRouter as Router, Route, Routes } from "react-router";
import Home from "./pages/Home";
import RequesterDashboard from "./pages/RequesterDashboard";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        
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
