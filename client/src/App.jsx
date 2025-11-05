import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth provider
import AuthProvider from "./context/AuthContext";

// Public pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Dish from "./pages/Dish";
import Reservations from "./pages/Reservations";
import ReservationConfirm from "./pages/ReservationConfirm";
import Confirm from "./pages/Confirm";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Client account pages
import Account from "./pages/Account";
import MyReservations from "./pages/MyReservations";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminTables from "./pages/admin/AdminTables";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<AppShell><Home /></AppShell>} />
        <Route path="/menu" element={<AppShell><Menu /></AppShell>} />
        <Route path="/menu/:id" element={<AppShell><Dish /></AppShell>} />
        <Route path="/reservations" element={<AppShell><Reservations /></AppShell>} />
        <Route path="/reservations/confirm/:id" element={<ReservationConfirm />} />
        <Route path="/confirm/:id" element={<AppShell><Confirm /></AppShell>} />
        <Route path="/contact" element={<AppShell><Contact /></AppShell>} />

        {/* Auth */}
        <Route path="/login" element={<AppShell><Login /></AppShell>} />
        <Route path="/register" element={<AppShell><Register /></AppShell>} />

        {/* Client-only */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AppShell><Account /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/reservations"
          element={
            <ProtectedRoute>
              <AppShell><MyReservations /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <AppShell><Profile /></AppShell>
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AppShell><AdminDashboard /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="admin">
              <AppShell><AdminMenu /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute role="admin">
              <AppShell><AdminReservations /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute role="admin">
              <AppShell><AdminTables /></AppShell>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<AppShell><NotFound /></AppShell>} />
      </Routes>
    </AuthProvider>
  );
}
