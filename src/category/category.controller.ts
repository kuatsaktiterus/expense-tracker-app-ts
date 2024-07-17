import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../common/auth.decorator';
import {
  CategoryResponse,
  IdCategoryRequest,
  InsertCategoryRequest,
  ListCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import { CategoryService } from './category.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('/api/v1/categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) { }

  @Post()
  @HttpCode(200)
  async insert(
    @Auth() user: User,
    @Body() request: InsertCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    request.id_user = user.id;
    const result = await this.categoryService.insert(request);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Body() request: ListCategoryRequest,
  ): Promise<WebResponse<CategoryResponse[]>> {
    request.page = request.page || 1;
    request.size = request.size || 10;

    const result = await this.categoryService.list(user, request);

    return result;
  }

  @Get('/:id')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('id') id: string,
  ): Promise<WebResponse<CategoryResponse>> {
    const request: IdCategoryRequest = { id: id };
    const result = await this.categoryService.get(user, request);

    return {
      data: result,
    };
  }

  @Put('/:id')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateCategoryRequest,
    @Param('id') id: string,
  ): Promise<WebResponse<CategoryResponse>> {
    request.id = id;
    const result = await this.categoryService.update(user, request);

    return {
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('id') id: string,
  ): Promise<WebResponse<boolean>> {
    const request: IdCategoryRequest = { id: id };
    await this.categoryService.remove(user, request);

    return {
      data: true,
    };
  }
}
