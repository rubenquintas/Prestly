import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth";

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventario", path: "/inventory", icon: Package },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-black text-indigo-600">Prestly</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
      >
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </div>
  );
};
