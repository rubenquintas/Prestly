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

  const { data } = await api.get(`/borrowers?${params.toString()}`);
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
  const { data } = await api.get("/departments");
  return data;
};
