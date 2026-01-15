import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/components/layout/Layout";
import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/pages/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/notes" replace />} />
            <Route path="login" element={<LoginPage />} />

            <Route path="notes" element={<ProtectedRoute />}>
              <Route index element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster richColors />
    </AuthProvider>
  );
}

export default App;