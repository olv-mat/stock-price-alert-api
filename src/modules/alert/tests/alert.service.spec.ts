import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { makeAccessTokenPayload } from 'src/common/test/factories/access-token-payload.factory';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { Repository } from 'typeorm';
import { AlertService } from '../alert.service';
import { AlertEntity } from '../entities/alert.entity';
import { makeAlertEntity } from './factories/alert.entity.factory';
import { makeCreateAlertDto } from './factories/create-alert.dto.factory';

type AlertServiceContext = {
  alertService: AlertService;
  alertRepositoryMock: Repository<AlertEntity>;
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
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    context = {
      alertService: module.get(AlertService),
      alertRepositoryMock: module.get(getRepositoryToken(AlertEntity)),
    };
  });

  describe('findAll', () => {
    it('should return a list of alerts', async () => {
      const { alertRepositoryMock, alertService } = context;
      const { sub } = makeAccessTokenPayload();
      const alertEntities = [makeAlertEntity()];
      const spy = jest
        .spyOn(alertRepositoryMock, 'find')
        .mockResolvedValue(alertEntities);
      const response = await alertService.findAll(sub);
      expect(spy).toHaveBeenCalledWith({ where: { user: { id: sub } } });
      expect(response).toEqual(alertEntities);
    });
  });

  describe('findOne', () => {
    it('should return a alert', async () => {
      const { alertRepositoryMock, alertService } = context;
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
      const { alertRepositoryMock, alertService } = context;
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
    it('should create a new alert', async () => {
      const { alertRepositoryMock, alertService } = context;
      const { sub } = makeAccessTokenPayload();
      const dto = makeCreateAlertDto();
      const alertEntity = makeAlertEntity();
      const spy = jest
        .spyOn(alertRepositoryMock, 'save')
        .mockResolvedValue(alertEntity);
      const response = await alertService.create(sub, dto);
      expect(spy).toHaveBeenCalledWith({
        ...dto,
        user: { id: sub },
      });
      expect(response).toEqual(alertEntity);
    });
  });

  describe('delete', () => {
    it('should delete a alert', async () => {
      const { alertRepositoryMock, alertService } = context;
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
      const { alertRepositoryMock, alertService } = context;
      const { sub } = makeAccessTokenPayload();
      const { id } = makeUuidDto({
        id: '27d00cd0-31c8-4630-9e4f-e2f890689a73',
      });
      const spy = jest.spyOn(alertRepositoryMock, 'delete');
      jest.spyOn(alertRepositoryMock, 'findOne').mockResolvedValue(null);
      await expect(alertService.delete(sub, id)).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
