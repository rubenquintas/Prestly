import React, { useEffect, useState } from "react";
import { getLoans, createLoan, returnItem, type Loan } from "../api/loans";
import { getItems } from "../api/items";
import { getBorrowers, type Borrower } from "../api/borrowers";
import { Modal } from "../components/Modal";
import {
  Plus,
  Calendar,
  User,
  Package,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { Item } from "../types";
import { isAfter, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export const Loans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newLoan, setNewLoan] = useState({
    itemId: "",
    borrowerId: "",
    dueDate: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loansData, itemsData, borrowersData] = await Promise.all([
        getLoans(),
        getItems("", "AVAILABLE"),
        getBorrowers(),
      ]);
      setLoans(loansData);
      setAvailableItems(itemsData);
      setBorrowers(borrowersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createLoan(newLoan);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el préstamo");
    }
  };

  const handleReturn = async (id: string) => {
    if (window.confirm("¿Confirmas la devolución del equipo?")) {
      await returnItem(id);
      fetchData();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Gestión de Préstamos
          </h1>
          <p className="text-slate-500 font-medium">
            Control de salida y entrada de equipos
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Nuevo Préstamo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-10 text-center animate-pulse text-slate-400 font-bold italic">
            Sincronizando préstamos...
          </div>
        ) : loans.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <Clock size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold text-xl">
              No hay préstamos activos ahora mismo
            </p>
          </div>
        ) : (
          loans.map((loan) => {
            const isReturned = loan.status === "RETURNED";
            const isLate =
              isAfter(new Date(), parseISO(loan.dueDate)) &&
              loan.status === "ACTIVE";

            const displayDate = isReturned ? loan.returnDate : loan.dueDate;
            const dateLabel = isReturned
              ? "Devuelto el"
              : "Fecha prevista de devolución";
            return (
              <div
                key={loan.id}
                className={`bg-white rounded-3xl p-6 border transition-all ${isLate ? "border-rose-200 bg-rose-50/30" : "border-slate-200 shadow-sm"}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-1 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
                      <Package className="text-slate-400" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {loan.item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-indigo-600 font-bold mt-1">
                        <User size={16} />
                        <span>{loan.borrower.name}</span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({loan.borrower.department.name})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                        {dateLabel}
                      </p>
                      <div
                        className={`flex items-center gap-2 font-bold ${isLate ? "text-rose-600" : "text-slate-700"}`}
                      >
                        <Calendar size={16} />
                        {format(parseISO(displayDate), "d MMM, yyyy", {
                          locale: es,
                        })}
                      </div>
                    </div>

                    {loan.status === "ACTIVE" ? (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Devolver
                      </button>
                    ) : (
                      <span className="px-5 py-3 bg-slate-100 text-slate-400 rounded-2xl font-bold flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Devuelto
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Préstamo"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              ¿Qué equipo quieres prestar?
            </label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              value={newLoan.itemId}
              onChange={(e) =>
                setNewLoan({ ...newLoan, itemId: e.target.value })
              }
              required
            >
              <option value="">Selecciona un equipo disponible...</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              ¿A quién se entrega?
            </label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              value={newLoan.borrowerId}
              onChange={(e) =>
                setNewLoan({ ...newLoan, borrowerId: e.target.value })
              }
              required
            >
              <option value="">Selecciona un beneficiario...</option>
              {borrowers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.department.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Fecha prevista de devolución
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              value={newLoan.dueDate}
              onChange={(e) =>
                setNewLoan({ ...newLoan, dueDate: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all"
          >
            Confirmar Préstamo
          </button>
        </form>
      </Modal>
    </div>
  );
};
