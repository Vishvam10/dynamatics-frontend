import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BuilderView from "./pages/builder-view";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder" element={<BuilderView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
