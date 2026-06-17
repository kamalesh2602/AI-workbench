import { BrowserRouter, Routes, Route ,Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/login"/>
  }
/>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>
        <Route path="/workspace/:id" element={<ProtectedRoute><Workspace/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;