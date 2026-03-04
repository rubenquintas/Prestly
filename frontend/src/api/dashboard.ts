import api from "./axios";

export interface DashboardStats {
  overdueCount: number;
  outOfServiceCount: number;
  expiringToday: any[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};
