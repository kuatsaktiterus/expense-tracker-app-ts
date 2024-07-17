import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  CategoryResponse,
  IdCategoryRequest,
  InsertCategoryRequest,
  ListCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { ValidationService } from '../common/validation.service';
import { CategoryValidation } from './category.validation';
import { Category, User } from '@prisma/client';
import { WebResponse } from '../model/web.model';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) { }

  async insert(request: InsertCategoryRequest): Promise<CategoryResponse> {
    const insertRequest: InsertCategoryRequest =
      this.validationService.validate(CategoryValidation.INSERT, request);

    const category = await this.prismaService.category.create({
      data: insertRequest,
    });

    return this.toCategoryResponse(category);
  }

  toCategoryResponse(category: Category): CategoryResponse {
    return {
      id: category.id,
      category: category.category,
      id_user: category.id_user,
    };
  }

  async list(
    user: User,
    request: ListCategoryRequest,
  ): Promise<WebResponse<CategoryResponse[]>> {
    const listRequest: ListCategoryRequest = this.validationService.validate(
      CategoryValidation.LIST,
      request,
    );

    const skip = (listRequest.page - 1) * listRequest.size;

    const [totalOfCategories, categories] =
      await this.prismaService.$transaction([
        this.prismaService.category.count(),
        this.prismaService.category.findMany({
          where: { id_user: user.id },
          skip: skip,
          take: listRequest.size,
        }),
      ]);

    return {
      data: categories.map((_) => this.toCategoryResponse(_)),
      paging: {
        size: listRequest.size,
        total_page: Math.ceil(totalOfCategories / listRequest.size),
        current_page: listRequest.page,
      },
    };
  }

  async checkCategoryExistence(user: User, id: string): Promise<Category> {
    return await this.prismaService.category.findFirst({
      where: { id, id_user: user.id },
    });
  }

  async update(
    user: User,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const updateRequest: UpdateCategoryRequest =
      this.validationService.validate(CategoryValidation.UPDATE, request);

    let category = await this.checkCategoryExistence(user, updateRequest.id);

    category = await this.prismaService.category.update({
      where: { id: category.id },
      data: {
        category: updateRequest.category,
      },
    });

    return this.toCategoryResponse(category);
  }

  async get(user: User, request: IdCategoryRequest): Promise<CategoryResponse> {
    const getRequest: IdCategoryRequest = this.validationService.validate(
      CategoryValidation.GET,
      request,
    );
    const category = await this.checkCategoryExistence(user, getRequest.id);

    return this.toCategoryResponse(category);
  }

  async remove(user: User, request: IdCategoryRequest) {
    const removeRequest: IdCategoryRequest = this.validationService.validate(
      CategoryValidation.GET,
      request,
    );
    await this.prismaService.category.delete({
      where: {
        id: removeRequest.id,
        id_user: user.id,
      },
    });
  }
}
