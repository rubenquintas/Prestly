import { useEffect, useState } from "react";
import { getItems } from "../api/items";
import type { Item } from "../types";
import { Search, Plus, Package, Filter } from "lucide-react";

export const Inventory = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems(search, statusFilter);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  const getStatusBadge = (status: Item["status"]) => {
    const styles = {
      AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      IN_USE: "bg-amber-100 text-amber-700 border-amber-200",
      REPAIRING: "bg-rose-100 text-rose-700 border-rose-200",
      RETIRED: "bg-slate-100 text-slate-700 border-slate-200",
    };
    const labels = {
      AVAILABLE: "Disponible",
      IN_USE: "En uso",
      REPAIRING: "En reparación",
      RETIRED: "Retirado",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Inventario
          </h1>
          <p className="text-slate-500 font-medium">
            Gestiona y controla los equipos
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <Plus size={20} />
          Nuevo Equipo
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre de equipo..."
            className="flex-1 py-3 bg-transparent border-none focus:outline-none font-medium text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1 min-w-55">
          <Filter className="text-slate-400 shrink-0" size={18} />
          <select
            className="w-full py-3 bg-transparent focus:outline-none font-bold text-slate-700 text-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="IN_USE">En uso</option>
            <option value="REPAIRING">En reparación</option>
            <option value="RETIRED">Retirado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-medium italic">
            Buscando equipos...
          </div>
        ) : items.length === 0 ? (
          <div className="p-20 text-center">
            <Package className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-500 font-bold text-xl">
              No se han encontrado equipos
            </p>
            <p className="text-slate-400">
              Prueba con otros filtros o añade uno nuevo.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Equipo
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Estado
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Última Actividad
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                        <Package size={24} />
                      </div>
                      <span className="font-black text-slate-900 text-lg">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(item.status)}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-600">
                      {new Date(item.updatedAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 font-bold text-sm">
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
