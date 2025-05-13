// src/layouts/MainLayout.jsx
import Navbar2 from "../components/Navbar2";
import { Outlet } from "react-router-dom";

const MainLayout2 = () => {
  return (
    <>
      <Navbar2 />
      <Outlet />
    </>
  );
};

export default MainLayout2;
