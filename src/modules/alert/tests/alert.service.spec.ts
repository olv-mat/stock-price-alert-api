import { getQueueToken } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { makeAccessTokenPayload } from 'src/common/test/factories/access-token-payload.factory';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { Repository } from 'typeorm';
import { AlertService } from '../alert.service';
import { AlertEntity } from '../entities/alert.entity';
import { AlertJob } from '../types/alert-job.type';
import { makeAlertFiltersDto } from './factories/alert-filters.dto.factory';
import { makeAlertEntity } from './factories/alert.entity.factory';
import { makeCreateAlertDto } from './factories/create-alert.dto.factory';
import { makeUpdateAlertDto } from './factories/update-alert.dto.factory';

type AlertServiceContext = {
  alertService: AlertService;
  alertRepositoryMock: Repository<AlertEntity>;
  queueMock: Queue<AlertJob>;
};

describe('AlertService', () => {
  let context: AlertServiceContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AlertService,
        {
          provide: getRepositoryToken(AlertEntity),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getQueueToken('alerts'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();
    context = {
      alertService: module.get(AlertService),
      alertRepositoryMock: module.get(getRepositoryToken(AlertEntity)),
      queueMock: module.get(getQueueToken('alerts')),
    };
  });

  describe('findAll', () => {
    it('should return a list and count of alerts', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const filters = makeAlertFiltersDto();
      const alertEntitiesAndCount: [AlertEntity[], number] = [
        [makeAlertEntity()],
        1,
      ];
      const spy = jest
        .spyOn(alertRepositoryMock, 'findAndCount')
        .mockResolvedValue(alertEntitiesAndCount);
      const response = await alertService.findAll(sub, filters);
      expect(spy).toHaveBeenCalledWith({
        where: {
          status: filters.status,
          ticker: filters.ticker,
          user: { id: sub },
        },
        skip: 0,
        take: filters.limit,
        order: {
          createdAt: 'DESC',
        },
      });
      expect(response).toEqual(alertEntitiesAndCount);
    });
  });

  describe('findOne', () => {
    it('should return an alert', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto();
      const alertEntity = makeAlertEntity();
      const spy = jest
        .spyOn(alertRepositoryMock, 'findOne')
        .mockResolvedValue(alertEntity);
      const response = await alertService.findOne(sub, id);
      expect(spy).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
      expect(response).toEqual(alertEntity);
    });

    it('should throw a not found excpetion when alert does not exist', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto();
      const spy = jest
        .spyOn(alertRepositoryMock, 'findOne')
        .mockResolvedValue(null);
      await expect(alertService.findOne(sub, id)).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
    });
  });

  describe('create', () => {
    it('should create a new alert and add it to the queue', async () => {
      const { alertService, alertRepositoryMock, queueMock } = context;
      const { sub } = makeAccessTokenPayload();
      const dto = makeCreateAlertDto();
      const alertEntity = makeAlertEntity();
      const sipes = {
        save: jest
          .spyOn(alertRepositoryMock, 'save')
          .mockResolvedValue(alertEntity),
        add: jest.spyOn(queueMock, 'add'),
      };
      const response = await alertService.create(sub, dto);
      expect(sipes.save).toHaveBeenCalledWith({
        ...dto,
        user: { id: sub },
      });
      expect(sipes.add).toHaveBeenCalled();
      expect(response).toEqual(alertEntity);
    });
  });

  describe('update', () => {
    it('should update an alert', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto();
      const dto = makeUpdateAlertDto();
      const alertEntity = makeAlertEntity();
      const spies = {
        findOne: jest
          .spyOn(alertRepositoryMock, 'findOne')
          .mockResolvedValue(alertEntity),
        update: jest.spyOn(alertRepositoryMock, 'update'),
      };
      await alertService.update(sub, id, dto);
      expect(spies.findOne).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
      expect(spies.update).toHaveBeenCalledWith(alertEntity.id, dto);
    });

    it('should throw a not found exception when alert does not exist', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto();
      const dto = makeUpdateAlertDto();
      const spies = {
        findOne: jest
          .spyOn(alertRepositoryMock, 'findOne')
          .mockResolvedValue(null),
        update: jest.spyOn(alertRepositoryMock, 'update'),
      };
      await expect(alertService.update(sub, id, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(spies.findOne).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
      expect(spies.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an alert', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto();
      const alertEntity = makeAlertEntity();
      const spies = {
        findOne: jest
          .spyOn(alertRepositoryMock, 'findOne')
          .mockResolvedValue(alertEntity),
        delete: jest.spyOn(alertRepositoryMock, 'delete'),
      };
      await alertService.delete(sub, id);
      expect(spies.findOne).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
      expect(spies.delete).toHaveBeenCalledWith(alertEntity.id);
    });

    it('should throw a not found exception when alert does not exist', async () => {
      const { alertService, alertRepositoryMock } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto({
        id: '27d00cd0-31c8-4630-9e4f-e2f890689a73',
      });
      const spies = {
        findOne: jest
          .spyOn(alertRepositoryMock, 'findOne')
          .mockResolvedValue(null),
        delete: jest.spyOn(alertRepositoryMock, 'delete'),
      };
      await expect(alertService.delete(sub, id)).rejects.toThrow(
        NotFoundException,
      );
      expect(spies.findOne).toHaveBeenCalledWith({
        where: { id: id, user: { id: sub } },
      });
      expect(spies.delete).not.toHaveBeenCalled();
    });
  });
});
