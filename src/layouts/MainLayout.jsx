import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar"; // Assuming you have a Navbar component
import Footer from '../components/Footer'; // This will be our new Footer component

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;