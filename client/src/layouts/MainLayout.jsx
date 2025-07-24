import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content fills available space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Sticky Footer at bottom */}
   <Footer></Footer>
    </div>
  );
};

export default MainLayout;
