import { useEffect, useState } from "react";
import {
  getDashboardStats,
  type DashboardStats,
  type DashboardLoan,
} from "../api/dashboard";
import {
  AlertCircle,
  CheckCircle2,
  Wrench,
  Calendar,
  User,
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((error) => console.error("Error fetching stats:", error))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (count: number) => {
    if (count === 0) return "bg-emerald-500 shadow-emerald-200";
    if (count <= 5) return "bd-amber-500 shadow-amber-200";
    return "bg-rose-600 shadow-rose-200";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-200 animate-bounce"></div>
          <p className="text-slate-500 font-medium">
            Cargando panel de control...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Panel de Control
        </h1>
        <p className="text-slate-500 mt-1 font-medium italic">
          Estado actual de los préstamos en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div
          className={`${getStatusColor(stats?.overdueCount || 0)} rounded-3xl p-8 text-white shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-48`}
        >
          <div className="flex justify-between items-start">
            {stats?.overdueCount === 0 ? (
              <CheckCircle2 size={40} />
            ) : (
              <AlertCircle size={40} />
            )}
            <span className="text-6xl font-black tabular-nums leading-none">
              {stats?.overdueCount || 0}
            </span>
          </div>
          <div>
            <p className="text-xl font-bold opacity-90">
              Préstamos con retraso
            </p>
            <p className="text-xs font-medium opacity-75 mt-1 uppercase tracking-wider">
              Acción inmediata requerida
            </p>
          </div>
        </div>

        <div
          className={`${getStatusColor(stats?.outOfServiceCount || 0)} rounded-3xl p-8 text-white shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-48`}
        >
          <div className="flex justify-between items-start">
            <Wrench size={40} />
            <span className="text-6xl font-black tabular-nums leading-none">
              {stats?.outOfServiceCount || 0}
            </span>
          </div>
          <div>
            <p className="text-xl font-bold opacity-90">
              Equipos en reparación
            </p>
            <p className="text-xs font-medium opacity-75 mt-1 uppercase tracking-wider">
              Inventario no disponible
            </p>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <Calendar size={40} />
            <span className="text-6xl font-black tabular-nums leading-none">
              {stats?.expiringToday.length || 0}
            </span>
          </div>
          <div>
            <p className="text-xl font-bold opacity-90">Vencimientos de hoy</p>
            <p className="text-xs font-medium opacity-75 mt-1 uppercase tracking-wider">
              Planificación de recogida
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recogidas del día
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Contacta con los beneficiarios para la devolución
            </p>
          </div>
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">
            {stats?.expiringToday.length} tareas
          </span>
        </div>

        <div className="p-2">
          {stats?.expiringToday.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">
                Hoy no se curra. No hay devoluciones previstas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-slate-100">
              {stats?.expiringToday.map((loan: DashboardLoan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-6">
                    <div className="bg-white shadow-sm border border-slate-200 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                      <User className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">
                        {loan.borrower.name}
                      </p>
                      <p className="text-slate-500 font-bold text-sm">
                        Préstamo de{" "}
                        <span className="text-indigo-600 uppercase tracking-tighter">
                          {loan.item.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase">
                      {loan.borrower.department.name}
                    </span>
                    <a
                      href={`mailto:${loan.borrower.email}`}
                      className="text-indigo-600 font-bold text-sm hover:underline decoration-2"
                    >
                      {loan.borrower.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
