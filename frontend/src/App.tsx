import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import type React from "react";
import { useAuth } from "./context/useAuth";
import { AuthProvider } from "./context/AuthProvider";
import { Dashboard } from "./pages/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { Inventory } from "./pages/Inventory";
import { Borrowers } from "./pages/Borrowers";
import { Loans } from "./pages/Loans";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex bg-slate-50">
    <Sidebar />
    <main className="flex-1">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Borrowers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <Layout>
                  <Loans />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
