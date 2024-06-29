export class ExpenseResponse {
  id: string;
  expense: number;
  expense_name: string;
  date_of_expense: Date;
  id_user: string;
}


export class InsertExpenseRequest {
  expense: number;
  expense_name: string;
  date_of_expense: Date;
  id_user: string;
}
