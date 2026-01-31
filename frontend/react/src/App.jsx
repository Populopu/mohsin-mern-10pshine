import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landingPage"

import ProtectedRoute from "./components/protectedRoutes";
import PublicRoute from "./components/publicRoutes";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route 
        path="/dashboard"
        element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
