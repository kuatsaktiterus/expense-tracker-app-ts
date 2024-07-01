export class IncomeResponse {
  id: string;
  income: number;
  income_name: string;
  date_of_income: Date;
  id_user: string;
}

export class InsertIncomeRequest {
  income: number;
  income_name: string;
  date_of_income: Date;
}
