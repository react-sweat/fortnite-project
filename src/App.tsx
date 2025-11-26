import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 flex flex-col">
        
        <Navbar />

        <AppRoutes />

      </div>
    </BrowserRouter>
  );
}
