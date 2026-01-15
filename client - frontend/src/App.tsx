import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/components/layout/Layout";
import HomePage from "./components/pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* / */}
          <Route index element={<Navigate to="/notes" replace />} />

          {/* /notes */}
          <Route path="/notes" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
