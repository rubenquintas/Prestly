import { useCallback, useEffect, useState } from "react";
import { createItem, deleteItem, getItems, updateItem } from "../api/items";
import type { Item } from "../types";
import {
  Search,
  Plus,
  Package,
  Filter,
  Wrench,
  Edit2,
  Trash2,
} from "lucide-react";
import { Modal } from "../components/Modal";

export const Inventory = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems(search, statusFilter);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  const handleCreateItem = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsSubmitting(true);
    try {
      await createItem(newItemName);
      setNewItemName("");
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Error al crear el equipo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateItem(id, { status: newStatus });
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      try {
        await deleteItem(id);
        fetchItems();
      } catch (error) {
        console.error(error);
        alert("No se puede eliminar un equipo que tiene préstamos asociados");
      }
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
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
                  <td className="px-8 py-6 text-right relative group">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStatusChange(item.id, "REPAIRING")}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg"
                        title="Mandar a Reparar"
                      >
                        <Wrench size={18} />
                      </button>

                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir nuevo equipo"
      >
        <form onSubmit={handleCreateItem} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nombre del equipo / Modelo
            </label>
            <input
              type="text"
              placeholder="Ej: MackBook Pro"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar equipo"}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Editar equipo"
      >
        {editingItem && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateItem(editingItem.id, {
                name: editingItem.name,
                status: editingItem.status,
              });
              setEditingItem(null);
              fetchItems();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Nombre
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Estado
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                value={editingItem.status}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    status: e.target.value as Item["status"],
                  })
                }
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="IN_USE">En Uso</option>
                <option value="REPAIRING">En Reparación</option>
                <option value="RETIRED">Retirado</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
            >
              Guardar Cambios
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
