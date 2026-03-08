import api from "./axios";

export interface Department {
  id: string;
  name: string;
}

export interface Borrower {
  id: string;
  name: string;
  email: string;
  department: Department;
}

export const getBorrowers = async (search?: string): Promise<Borrower[]> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const { data } = await api.get(`/borrowers/${params.toString()}`);
  return data;
};

export const createBorrower = async (borrowerData: {
  name: string;
  email: string;
  departmentId: string;
}): Promise<Borrower> => {
  const { data } = await api.post("/borrowers", borrowerData);
  return data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await api.get("/borrowers/departments");
  return data;
};

export const updateBorrower = async (
  id: string,
  data: { name?: string; email?: string; departmentId?: string },
): Promise<Borrower> => {
  const { data: response } = await api.put(`/borrowers/${id}`, data);
  return response;
};

export const deleteBorrower = async (id: string): Promise<void> => {
  await api.delete(`/borrowers/${id}`);
};
