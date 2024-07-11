import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Expense Controller', () => {
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

  describe('POST /api/v1/expenses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createSummary();
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .set('Authorization', 'test')
        .send({
          expense: 0,
          expense_name: '',
          date_of_expense: '',
          id_category: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert expense', async () => {
      const category = await testService.getCategory();
      const user = await testService.getUser();
      const time = new Date('2024-01-01');
      const response = await request(app.getHttpServer())
        .post('/api/v1/expenses')
        .set('Authorization', 'test')
        .send({
          expense: 300000,
          expense_name: 'uang jajan minggu ini',
          date_of_expense: time,
          id_category: category.id,
        });
      logger.info(response.body);

      const dateOfExpense = new Date(
        response.body.data.date_of_expense,
      ).toString();

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data.expense).toBe(300000);
      expect(summary.expenses_total).toBe(10300000);
      expect(response.body.data.expense_name).toBe('uang jajan minggu ini');
      expect(dateOfExpense).toBe(`${time}`);
      expect(response.body.data.id_category).toBe(category.id);
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('GET LIST /api/v1/expenses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
      await testService.createExpense();
    });

    it('should be rejected if unauthorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/v1/expenses',
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to list expense', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/expenses')
        .set('Authorization', 'test')
        .send({
          page: 2,
          size: 1,
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });

  describe('GET /api/v1/expenses/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
      await testService.createExpense();
    });

    it('should be rejected if unauthorized', async () => {
      const expense = await testService.getExpense();
      const response = await request(app.getHttpServer()).get(
        `/api/v1/expenses/${expense.id}`,
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get an expense', async () => {
      const expense = await testService.getExpense();
      const user = await testService.getUser();
      const response = await request(app.getHttpServer())
        .get(`/api/v1/expenses/${expense.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.expense).toBe(3000000);
      expect(response.body.data.expense_name).toBe('test expense');
      expect(response.body.data.date_of_expense).toBe(
        new Date('2024-01-01').toISOString(),
      );
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('PUT /api/v1/expenses/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
      await testService.createExpense();
      await testService.createSummary();
    });

    it('should be rejected if unauthorized', async () => {
      const expense = await testService.getExpense();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/expenses/${expense.id}`)
        .send({
          expense: 100,
          expense_name: 'test update expense',
          date_of_expense: new Date('2024-01-02'),
        });
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update expense and summary get lower', async () => {
      const category = await testService.getCategory();
      const expense = await testService.getExpense();
      const user = await testService.getUser();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/expenses/${expense.id}`)
        .set('Authorization', 'test')
        .send({
          expense: 100000,
          expense_name: 'test update expense',
          date_of_expense: new Date('2024-01-02'),
          id_category: category.id
        });
      logger.info(response.body);

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data.expense).toBe(100000);
      expect(summary.expenses_total).toBe(7100000);
      expect(response.body.data.expense_name).toBe('test update expense');
      expect(response.body.data.date_of_expense).toBe(
        new Date('2024-01-02').toISOString(),
      );
      expect(response.body.data.id_category).toBe(category.id);
      expect(response.body.data.id_user).toBe(user.id);
    });

    it('should be able to update expense and summary get higher', async () => {
      const category = await testService.getCategory();
      const expense = await testService.getExpense();
      const user = await testService.getUser();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/expenses/${expense.id}`)
        .set('Authorization', 'test')
        .send({
          expense: 4000000,
          expense_name: 'test update expense',
          date_of_expense: new Date('2024-01-02'),
          id_category: category.id
        });
      logger.info(response.body);

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data.expense).toBe(4000000);
      expect(summary.expenses_total).toBe(11000000);
      expect(response.body.data.expense_name).toBe('test update expense');
      expect(response.body.data.date_of_expense).toBe(
        new Date('2024-01-02').toISOString(),
      );
      expect(response.body.data.id_category).toBe(category.id);
      expect(response.body.data.id_user).toBe(user.id);
    });

    it('should be rejected if expense id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/expenses/6680c4bf717c7f143a914d82`)
        .set('Authorization', 'test')
        .send({
          expense: 100,
          expense_name: 'test update expense',
          date_of_expense: new Date('2024-01-02'),
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/expenses/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createCategory();
      await testService.createExpense();
      await testService.createSummary();
    });

    it('should be invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/expenses/6680c4bf717c7f143a914d82`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete expense', async () => {
      const expense = await testService.getExpense();
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/expenses/${expense.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
      expect(summary.expenses_total).toBe(7000000);
    });
  });
});
