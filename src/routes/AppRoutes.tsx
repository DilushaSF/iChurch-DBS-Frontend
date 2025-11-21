import {Routes, Route, Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import type {ReactNode} from "react";

// Layout imports
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Page imports
import Login from "../pages/Auth/Login.tsx";
import Register from "../pages/Auth/Register.tsx";

// Dashboard Page imports
import Dashboard from "../pages/Dashboard/Dashboard.tsx";

// Burials Page import - ADD THIS
import BurialsList from "../pages/Burials/BurialsList.tsx";
import AddBurial from "../pages/Burials/AddBurial.tsx";
import ViewBurial from "../pages/Burials/ViewBurial.tsx";
import EditBurial from "../pages/Burials/EditBurial.tsx";

// Protected Route Component
interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps) => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
        <Route path="dashboard" element={<Dashboard />} />

        {/* Burials Route - ADD THIS */}
        <Route path="burials" element={<BurialsList />} />
        <Route path="burials/add" element={<AddBurial />} />
        <Route path="burials/view/:id" element={<ViewBurial />} />
        <Route path="burials/edit/:id" element={<EditBurial />} />
        {/* Placeholder routes */}
        <Route path="members" element={<div>Members Page (Coming Soon)</div>} />
        <Route path="groups" element={<div>Groups Page (Coming Soon)</div>} />
        <Route path="events" element={<div>Events Page (Coming Soon)</div>} />
        <Route
          path="attendance"
          element={<div>Attendance Page (Coming Soon)</div>}
        />
        <Route
          path="donations"
          element={<div>Donations Page (Coming Soon)</div>}
        />
        <Route
          path="volunteers"
          element={<div>Volunteers Page (Coming Soon)</div>}
        />
        <Route
          path="ministry"
          element={<div>Ministry Page (Coming Soon)</div>}
        />
        <Route
          path="resources"
          element={<div>Resources Page (Coming Soon)</div>}
        />
        <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
        <Route
          path="settings"
          element={<div>Settings Page (Coming Soon)</div>}
        />
        <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
