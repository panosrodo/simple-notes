import Header from "./Header.tsx";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto pt-24 min-h-[92vh]">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;