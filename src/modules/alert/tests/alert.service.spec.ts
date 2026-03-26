import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertService } from '../alert.service';
import { AlertEntity } from '../entities/alert.entity';
import { makeAlertEntity } from './factories/alert.entity.factory';

type AlertServiceContext = {
  alertRepositoryMock: Repository<AlertEntity>;
  alertService: AlertService;
};

describe('AlertService', () => {
  let context: AlertServiceContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(AlertEntity),
          useValue: { find: jest.fn() },
        },
        AlertService,
      ],
    }).compile();
    context = {
      alertRepositoryMock: module.get(getRepositoryToken(AlertEntity)),
      alertService: module.get(AlertService),
    };
  });

  describe('findAll', () => {
    it('should return a list of alerts', async () => {
      const { alertRepositoryMock, alertService } = context;
      const expectedResponse = [makeAlertEntity()];
      const spy = jest
        .spyOn(alertRepositoryMock, 'find')
        .mockResolvedValue(expectedResponse);
      const response = await alertService.findAll();
      expect(spy).toHaveBeenCalled();
      expect(response).toEqual(expectedResponse);
    });
  });
});
