import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { Repository } from 'typeorm';
import { AlertService } from '../alert.service';
import { AlertEntity } from '../entities/alert.entity';
import { makeAlertEntity } from './factories/alert.entity.factory';
import { makeCreateAlertDto } from './factories/create-alert.dto.factory';

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
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
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
      const alertEntities = [makeAlertEntity()];
      const spy = jest
        .spyOn(alertRepositoryMock, 'find')
        .mockResolvedValue(alertEntities);
      const response = await alertService.findAll();
      expect(spy).toHaveBeenCalled();
      expect(response).toEqual(alertEntities);
    });
  });

  describe('findOne', () => {
    it('should return a alert', async () => {
      const { alertRepositoryMock, alertService } = context;
      const { id } = makeUuidDto();
      const alertEntity = makeAlertEntity();
      const spy = jest
        .spyOn(alertRepositoryMock, 'findOneBy')
        .mockResolvedValue(alertEntity);
      const response = await alertService.findOne(id);
      expect(spy).toHaveBeenCalledWith({ id: id });
      expect(response).toEqual(alertEntity);
    });

    it('should throw a not found excpetion when alert does not exist', async () => {
      const { alertRepositoryMock, alertService } = context;
      const { id } = makeUuidDto();
      const spy = jest
        .spyOn(alertRepositoryMock, 'findOneBy')
        .mockResolvedValue(null);
      await expect(alertService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith({ id: id });
    });
  });

  describe('create', () => {
    it('should create a new alert', async () => {
      const { alertRepositoryMock, alertService } = context;
      const dto = makeCreateAlertDto();
      const alertEntity = makeAlertEntity();
      const spy = jest
        .spyOn(alertRepositoryMock, 'save')
        .mockResolvedValue(alertEntity);
      const response = await alertService.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(response).toEqual(alertEntity);
    });
  });
});
