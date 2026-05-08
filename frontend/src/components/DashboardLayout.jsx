import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Background3D from './Background3D';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent flex-col md:flex-row font-sans relative">
      <Background3D opacity={0.4} />
      <Sidebar />
      <div className="flex-1 overflow-y-auto flex flex-col h-full relative z-10">
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
