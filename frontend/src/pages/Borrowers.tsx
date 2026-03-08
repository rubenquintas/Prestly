import React, { useEffect, useState, useCallback } from "react";
import {
  getBorrowers,
  updateBorrower,
  deleteBorrower,
  getDepartments,
  type Borrower,
  type Department,
  createBorrower,
} from "../api/borrowers";
import {
  Search,
  UserPlus,
  Mail,
  Building2,
  User,
  Edit2,
  Trash2,
} from "lucide-react";
import { Modal } from "../components/Modal";
import axios from "axios";

export const Borrowers = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    email: "",
    departmentId: "",
  });
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    getDepartments().then(setDepartments);
    return () => clearTimeout(timeout);
  }, [fetchBorrowers]);

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newBorrower.departmentId) {
      alert("Debes seleccionar un departamento");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBorrower(newBorrower);
      setNewBorrower({ name: "", email: "", departmentId: "" });
      setIsCreateModalOpen(false);
      fetchBorrowers();
    } catch (error) {
      console.error(error);
      alert("Error al crear el beneficiario. Revisa si el email ya existe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar a este beneficiario?",
      )
    ) {
      try {
        await deleteBorrower(id);
        fetchBorrowers();
      } catch (error) {
        console.error(error);
        alert("No se puede eliminar: tiene préstamos activos o históricos.");
      }
    }
  };

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBorrower) return;

    const deptId = editingBorrower.department.id;

    if (!deptId) {
      alert("Debes seleccionar un departamento válido");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBorrower(editingBorrower.id, {
        name: editingBorrower.name,
        email: editingBorrower.email,
        departmentId: deptId,
      });
      setEditingBorrower(null);
      fetchBorrowers();
    } catch (error: unknown) {
      let errorMessage = "Error inesperado al actualizar";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
        console.error("Error del servidor:", error.response?.data);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Beneficiario
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <Search className="text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar personal..."
          className="flex-1 py-1 bg-transparent border-none focus:outline-none font-medium text-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse"
            >
              <div className="bg-slate-100 w-14 h-14 rounded-2xl mb-4"></div>
              <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
            </div>
          ))}
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
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingBorrower(person)}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Beneficiario"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nombre completo
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              placeholder="Ej: Juan Pérez"
              value={newBorrower.name}
              onChange={(e) =>
                setNewBorrower({ ...newBorrower, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              placeholder="juan@empresa.com"
              value={newBorrower.email}
              onChange={(e) =>
                setNewBorrower({ ...newBorrower, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Departamento
            </label>
            {departments.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200">
                No hay departamentos. Crea uno primero.
              </div>
            ) : (
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newBorrower.departmentId}
                onChange={(e) =>
                  setNewBorrower({
                    ...newBorrower,
                    departmentId: e.target.value,
                  })
                }
                required
              >
                <option value="">Selecciona departamento...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || departments.length === 0}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isSubmitting ? "Creando..." : "Crear Beneficiario"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingBorrower}
        onClose={() => setEditingBorrower(null)}
        title="Editar datos personales"
      >
        {editingBorrower && (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={editingBorrower.name}
                onChange={(e) =>
                  setEditingBorrower({
                    ...editingBorrower,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={editingBorrower.email}
                onChange={(e) =>
                  setEditingBorrower({
                    ...editingBorrower,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Departamento
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                value={editingBorrower.department.id}
                onChange={(e) =>
                  setEditingBorrower({
                    ...editingBorrower,
                    department: {
                      ...editingBorrower.department,
                      id: e.target.value,
                    },
                  })
                }
              >
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                ) : (
                  <option value="">No hay departamentos disponibles</option>
                )}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingBorrower(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
