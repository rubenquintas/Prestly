import { useEffect, useState, useCallback } from "react";
import { getBorrowers, type Borrower } from "../api/borrowers";
import { Search, UserPlus, Mail, Building2, User } from "lucide-react";

export const Borrowers = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBorrowers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBorrowers(search);
      setBorrowers(data);
    } catch (error) {
      console.error("Error fetching borrowers", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchBorrowers, 300);
    return () => clearTimeout(timeout);
  }, [fetchBorrowers]);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Personal
          </h1>
          <p className="text-slate-500 font-medium">
            Gestiona los beneficiarios de los préstamos
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <UserPlus size={20} />
          Nuevo Beneficiario
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o departamento..."
            className="flex-1 py-3 bg-transparent border-none focus:outline-none font-medium text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-slate-400 font-medium italic animate-pulse">
          Cargando personal...
        </div>
      ) : borrowers.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <User className="mx-auto text-slate-200 mb-4" size={64} />
          <p className="text-slate-500 font-bold text-xl">
            No hay beneficiarios registrados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowers.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <User size={28} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  ID: {person.id.slice(-4)}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">
                {person.name}
              </h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={16} className="shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {person.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 size={16} className="shrink-0" />
                  <span className="text-sm font-bold text-indigo-600">
                    {person.department.name}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Ver Historial
                </button>
                <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
