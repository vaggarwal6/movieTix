
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation as useRouterLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useRouterLocation();
  const isBookingFlow = location.pathname.includes('/booking') || location.pathname.includes('/confirmation');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${!isBookingFlow ? 'container mx-auto px-4 py-8' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
