import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// ======================================================
// LAYOUT
// ======================================================

export default function Layout() {

  return (

    <div className="
      flex
      min-h-screen
      bg-[#070B14]
      text-white
      overflow-hidden
    ">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <Sidebar />

      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="
        flex-1
        flex
        flex-col
        relative
        overflow-hidden
      ">

        {/* ============================================= */}
        {/* NAVBAR */}
        {/* ============================================= */}

        <div className="
          sticky
          top-0
          z-40
          backdrop-blur-xl
        ">

          <Navbar />

        </div>

        {/* ============================================= */}
        {/* PAGE CONTENT */}
        {/* ============================================= */}

        <main className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          relative
          z-10
        ">

          {/* CONTENT WRAPPER */}

          <div className="
            p-4
            md:p-6
            lg:p-8
            max-w-[1800px]
            mx-auto
            w-full
          ">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}