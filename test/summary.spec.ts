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

  describe('GET /api/v1/summaries', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if request is unauthorized', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/v1/summaries',
      );
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get summary', async () => {
      const user = await testService.getUser();
      await testService.createSummary();
      const response = await request(app.getHttpServer())
        .get(`/api/v1/summaries`)
        .set('Authorization', 'test');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.incomes_total).toBe(10000000);
      expect(response.body.data.expenses_total).toBe(2000000);
      expect(response.body.data.incomes_count).toBe(10);
      expect(response.body.data.expenses_count).toBe(30);
      expect(response.body.data.id_user).toBe(user.id);
    });
  });
});
