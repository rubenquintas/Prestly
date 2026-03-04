export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Item {
  id: string;
  name: string;
  status: "AVAILABLE" | "IN_USE" | "REPAIRING" | "RETIRED";
  companyId: string;
  updatedAt: string;
}
