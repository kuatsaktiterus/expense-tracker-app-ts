import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Income Controller', () => {
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

  describe('POST /api/v1/incomes', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/incomes')
        .set('Authorization', 'test')
        .send({
          income: '',
          income_name: '',
          date_of_income: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert incomes', async () => {
      const user = await testService.getUser();
      const time = new Date('2024-01-01');
      const response = await request(app.getHttpServer())
        .post('/api/v1/incomes')
        .set('Authorization', 'test')
        .send({
          income: 300000,
          income_name: 'test income',
          date_of_income: time,
        });
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.income).toBe(300000);
      expect(response.body.data.income_name).toBe('test income');
      expect(response.body.data.date_of_income).toBe(time.toISOString());
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('GET /api/v1/incomes', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createIncome();
    });

    it('should be rejected if unautihorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/v1/incomes',
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to list income if size not include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/incomes')
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
        .get('/api/v1/incomes')
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

    it('should be able to list income if both page and size include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/incomes')
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

    it('should be able to list income if both page and size not include', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/incomes')
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
    });
  });

  describe('GET /api/v1/incomes/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createIncome();
    });

    it('should be rejected if unautihorized', async () => {
      const income = await testService.getIncome();
      const response = await request(app.getHttpServer()).get(
        `/api/v1/incomes/${income.id}`,
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get income', async () => {
      const income = await testService.getIncome();
      const user = await testService.getUser();
      const response = await request(app.getHttpServer())
        .get(`/api/v1/incomes/${income.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      const time = new Date('2024-01-01');

      expect(response.status).toBe(200);
      expect(response.body.data.income).toBe(3000000);
      expect(response.body.data.income_name).toBe('test income');
      expect(response.body.data.date_of_income).toBe(time.toISOString());
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('PUT /api/v1/incomes/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createIncome();
      await testService.createSummary();
    });

    it('should be rejected if request is invalid', async () => {
      const income = await testService.getIncome();
      const response = await request(app.getHttpServer())
        .put(`/api/v1/incomes/${income.id}`)
        .set('Authorization', 'test')
        .send({
          income: '',
          income_name: '',
          date_of_income: '',
        });
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update income and summary get lower', async () => {
      const income = await testService.getIncome();
      const user = await testService.getUser();
      const time = new Date('2024-01-02');
      const response = await request(app.getHttpServer())
        .put(`/api/v1/incomes/${income.id}`)
        .set('Authorization', 'test')
        .send({
          income: 100000,
          income_name: 'test income updated',
          date_of_income: time,
        });
      logger.info(response.body);

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data.income).toBe(100000);
      expect(summary.incomes_total).toBe(7100000);
      expect(response.body.data.income_name).toBe('test income updated');
      expect(response.body.data.date_of_income).toBe(time.toISOString());
      expect(response.body.data.id_user).toBe(user.id);
    });

    it('should be able to update income and summary get higher', async () => {
      const income = await testService.getIncome();
      const user = await testService.getUser();
      const time = new Date('2024-01-02');
      const response = await request(app.getHttpServer())
        .put(`/api/v1/incomes/${income.id}`)
        .set('Authorization', 'test')
        .send({
          income: 4000000,
          income_name: 'test income updated',
          date_of_income: time,
        });
      logger.info(response.body);

      const summary = await testService.getSummary();

      expect(response.status).toBe(200);
      expect(response.body.data.income).toBe(4000000);
      expect(summary.incomes_total).toBe(11000000);
      expect(response.body.data.income_name).toBe('test income updated');
      expect(response.body.data.date_of_income).toBe(time.toISOString());
      expect(response.body.data.id_user).toBe(user.id);
    });
  });

  describe('DELETE /api/v1/incomes/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createIncome(400000);
      await testService.createSummary();
    });

    it('should be rejected if unautihorized', async () => {
      const income = await testService.getIncome();
      const response = await request(app.getHttpServer()).delete(
        `/api/v1/incomes/${income.id}`,
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete income', async () => {
      const income = await testService.getIncome();
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/incomes/${income.id}`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
