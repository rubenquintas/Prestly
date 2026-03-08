import type { Item } from "../types";
import api from "./axios";
import type { Borrower } from "./borrowers";

export interface Loan {
  id: string;
  itemId: string;
  borrowerId: string;
  status: "ACTIVE" | "RETURNED";
  dueDate: string;
  startDate: string;
  returnDate: string;
  item: Item;
  borrower: Borrower;
}

export const getLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get("/loans");
  return data;
};

export const createLoan = async (loanData: {
  itemId: string;
  borrowerId: string;
  dueDate: string;
}): Promise<Loan> => {
  const { data } = await api.post("/loans", loanData);
  return data;
};

export const returnItem = async (loanId: string): Promise<void> => {
  await api.patch(`/loans/${loanId}/return`);
};
