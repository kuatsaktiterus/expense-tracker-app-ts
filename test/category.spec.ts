import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Category Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);
    await testService.deleteAll();
  });

  describe('POST /api/categories', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          category: '',
          id_user: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert category', async () => {
      const user = await testService.getUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          category: 'Kuliah',
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.category).toBe('Kuliah');
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('GET /api/v1/categories', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          page: '',
          size: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to list category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          page: 1,
          size: 10,
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
    });

    it('should be able to list income if size not include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          page: 1,
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
    });

    it('should be able to list income if page not include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', 'test')
        .send({
          size: 1,
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });

    it('should be able to list income if both page and size not include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .get(`/api/v1/categories/${category.id + 1}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get category', async () => {
      const user = await testService.getUser();
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .get(`/api/v1/categories/${category.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.category).toBe('Kuliah');
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('PUT /api/categories/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/categories/${category.id}`)
        .set('Authorization', 'test')
        .send({
          category: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is invalid', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/categories/${category.id + 1}`)
        .set('Authorization', 'test')
        .send({
          category: 'Kuliah updated',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update category', async () => {
      const user = await testService.getUser();
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/categories/${category.id}`)
        .set('Authorization', 'test')
        .send({
          category: 'Kuliah updated',
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.category).toBe('Kuliah updated');
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/categories/${category.id + 1}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete category', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/categories/${category.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
