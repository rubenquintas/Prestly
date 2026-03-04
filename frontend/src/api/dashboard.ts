import api from "./axios";

export interface DashboardLoan {
  id: string;
  item: {
    name: string;
  };
  borrower: {
    name: string;
    email: string;
    department: {
      name: string;
    };
  };
}

export interface DashboardStats {
  overdueCount: number;
  outOfServiceCount: number;
  expiringToday: DashboardLoan[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};
