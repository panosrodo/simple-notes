import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "@/components/layout/Layout.tsx";
import HomePage from "./components/pages/HomePage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
          <Route index element={<HomePage />}>
          </Route>
          </Route>
        </Routes> 
      </BrowserRouter>

    </>
  )
}

export default App