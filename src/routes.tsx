import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerSearch from "./pages/PlayerSearch";
import Placeholder from "./pages/Placeholder";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player-search" element={<PlayerSearch />} />
      <Route path="/placeholder" element={<Placeholder />} />
    </Routes>
  );
}
