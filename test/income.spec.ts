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

    it('should be able to insert expense', async () => {
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
});
