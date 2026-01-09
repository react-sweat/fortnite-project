import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const linkClass =
    "px-3 md:px-4 py-2 font-semibold transition-colors hover:text-blue-600 text-sm md:text-base";

  const activeClass = "text-blue-600 font-bold";

  return (
    <nav className="mb-6 md:mb-10">
      <div className="flex justify-center md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="hidden md:flex justify-center gap-4 lg:gap-6 text-slate-600">
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
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 text-slate-600 bg-white rounded-lg shadow-lg p-4 border border-slate-200">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/player-search"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            Player Stats
          </NavLink>

          <NavLink
            to="/shop"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/map"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            Map
          </NavLink>

          <NavLink
            to="/news"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            News
          </NavLink>

          <NavLink
            to="/charts"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass} w-full text-center` : `${linkClass} w-full text-center`
            }
          >
            Chart Builder
          </NavLink>
        </div>
      )}
    </nav>
  );
}
