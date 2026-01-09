import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass =
    "px-4 py-2 font-semibold transition-colors hover:text-blue-600";

  const activeClass = "text-blue-600 font-bold";

  return (
    <nav className="mb-10 flex justify-center gap-6 text-slate-600">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/player-search"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        Player Stats
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        Shop
      </NavLink>

      <NavLink
        to="/map"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        Map
      </NavLink>

      <NavLink
        to="/news"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        News
      </NavLink>

      <NavLink
        to="/charts"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
      >
        Chart Builder
      </NavLink>

    </nav>
  );
}
