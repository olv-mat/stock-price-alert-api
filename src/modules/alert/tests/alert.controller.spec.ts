import { NotFoundException } from '@nestjs/common';
import { describe } from 'node:test';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { AlertController } from '../alert.controller';
import { AlertService } from '../alert.service';
import { AlertResponseDto } from '../dtos/alert-response.dto';
import { makeAlertEntity } from './factories/alert.entity.factory';
import { makeCreateAlertDto } from './factories/create-alert.dto.factory';

describe('AlertController', () => {
  let alertController: AlertController;
  const alertServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    alertController = new AlertController(
      alertServiceMock as unknown as AlertService,
    );
  });

  describe('findAll', () => {
    it('should return a list of mapped alerts', async () => {
      alertServiceMock.findAll.mockResolvedValue([makeAlertEntity()]);
      const response = await alertController.findAll();
      expect(alertServiceMock.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every((item) => item instanceof AlertResponseDto)).toBe(
        true,
      );
    });

    it('should return a empty arrat if no alerts found', async () => {
      alertServiceMock.findAll.mockResolvedValue([]);
      const response = await alertController.findAll();
      expect(alertServiceMock.findAll).toHaveBeenCalled();
      expect(Array.isArray(response)).toBe(true);
      expect(response).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a mapped alert', async () => {
      const dto = makeUuidDto();
      alertServiceMock.findOne.mockResolvedValue(makeAlertEntity());
      const response = await alertController.findOne(dto);
      expect(alertServiceMock.findOne).toHaveBeenCalledWith(dto.id);
      expect(response instanceof AlertResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeUuidDto();
      alertServiceMock.findOne.mockRejectedValue(new NotFoundException());
      await expect(alertController.findOne(dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(alertServiceMock.findOne).toHaveBeenCalledWith(dto.id);
    });
  });

  describe('create', () => {
    it('should return a created response', async () => {
      const dto = makeCreateAlertDto();
      alertServiceMock.create.mockResolvedValue(makeAlertEntity());
      const response = await alertController.create(dto);
      expect(alertServiceMock.create).toHaveBeenCalledWith(dto);
      expect(response instanceof CreatedResponseDto).toBe(true);
    });
  });

  describe('delete', () => {
    it('should return a default response', async () => {
      const dto = makeUuidDto();
      alertServiceMock.delete.mockResolvedValue(undefined);
      const response = await alertController.delete(dto);
      expect(alertServiceMock.delete).toHaveBeenCalledWith(dto.id);
      expect(response instanceof DefaultResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeUuidDto();
      alertServiceMock.delete.mockRejectedValue(new NotFoundException());
      await expect(alertController.delete(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
