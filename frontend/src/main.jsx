import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminLogin } from './components/admin/AdminLogin.jsx'
import { AdminLayout } from './components/admin/AdminLayout.jsx'
import { ProtectedRoute } from './components/admin/ProtectedRoute.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#fff", background: "#07070e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "12px", color: "#FFB400" }}>Portfolio Error Encountered</h2>
          <p style={{ color: "#aaa", marginBottom: "24px", maxWidth: "500px" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "12px 24px", background: "#FFB400", color: "#0a0a14", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/danish-admin2220";

// Unregister any stale service worker from previous projects on localhost
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </StrictMode>,
)
