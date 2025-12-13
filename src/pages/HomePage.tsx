import { Link } from "react-router-dom";
import { Sword, Search, BarChart3, ShoppingBag, Map, Newspaper } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-6">

        <h1 className="text-2xl font-bold mb-2">
          Fortnite Platform
        </h1>
        <p className="text-gray-600 max-w-md mb-8">
          Check Fortnite player stats, progress, Battle Pass levels and more.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link
          to="/player-search"
          className="bg-blue-500 text-white px-4 py-3 rounded font-bold flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Look Up Player Stats
        </Link>

        <Link
          to="/shop"
          className="bg-purple-600 text-white px-4 py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Item Shop
        </Link>

        <Link
          to="/map"
          className="bg-green-600 text-white px-4 py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Map className="w-4 h-4" />
          View Map & Distance Tool
        </Link>

        <Link
          to="/news"
          className="bg-orange-600 text-white px-4 py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
        >
          <Newspaper className="w-4 h-4" />
          Browse Latest News
        </Link>

        <Link
          to="/placeholder"
          className="border border-gray-300 text-gray-800 px-4 py-3 rounded font-bold flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Placeholder
        </Link>
      </div>
    </div>
  );
}