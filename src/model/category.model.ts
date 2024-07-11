export class InsertCategoryRequest {
  category: string;
  id_user: string;
}

export class IdCategoryRequest {
  id: string;
}

export class UpdateCategoryRequest {
  id: string;
  category?: string;
}

export class CategoryResponse {
  id: string;
  category: string;
  id_user: string;
}

export class ListCategoryRequest {
  page: number;
  size: number;
}
