import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminLogin } from './components/admin/AdminLogin.jsx'
import { AdminLayout } from './components/admin/AdminLayout.jsx'
import { ProtectedRoute } from './components/admin/ProtectedRoute.jsx'

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-portal";

// Unregister any stale service worker from previous projects on localhost:5173
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Stale service worker unregistered:', registration);
          window.location.reload();
        }
      });
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path={`${ADMIN_PATH}/login`} element={<AdminLogin />} />
          <Route 
            path={ADMIN_PATH} 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
