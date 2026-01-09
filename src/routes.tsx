import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerSearch from "./pages/PlayerSearch";
import ShopPage from "./pages/ShopPage";
import MapPage from "./pages/MapPage";
import NewsPage from "./pages/NewsPage";
import Charts from "./pages/ChartBuilder/index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player-search" element={<PlayerSearch />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/charts" element={<Charts />} />
      <Route path="/chart/:encoded" element={<Charts />} />
    </Routes>
  );
}
