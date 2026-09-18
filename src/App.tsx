import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { SubmitRequest } from './pages/SubmitRequest';
import { TrackTicket } from './pages/TrackTicket';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { Devices } from './pages/Devices';
import { Labs } from './pages/Labs';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SubmitRequest />} />
            <Route path="/track" element={<TrackTicket />} />
            <Route path="/track/:ticketNumber" element={<TrackTicket />} />

            {/* Admin Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/:id" element={<TicketDetailsPage />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/labs" element={<Labs />} />
            </Route>

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
