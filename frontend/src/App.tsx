import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import type React from "react";
import { useAuth } from "./context/useAuth";
import { AuthProvider } from "./context/AuthProvider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
};

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
                <div className="p-10">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Bienvenido a Prestly
                  </h1>
                  <p className="mt-2 text-slate-600">
                    El sistema de gestión está listo
                  </p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
