import type { Item } from "../types";
import api from "./axios";

export const getItems = async (
  search?: string,
  status?: string,
): Promise<Item[]> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const { data } = await api.get(`/items?${params.toString()}`);
  return data;
};

export const createItem = async (name: string): Promise<Item> => {
  const { data } = await api.post("/items", { name });
  return data;
};

export const updateItem = async (
  id: string,
  data: { name?: string; status?: string },
): Promise<Item> => {
  const { data: response } = await api.put(`/items/${id}`, data);
  return response;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/ítems/${id}`);
};
