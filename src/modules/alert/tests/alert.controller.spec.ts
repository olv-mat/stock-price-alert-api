import { NotFoundException } from '@nestjs/common';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { AlertController } from '../alert.controller';
import { AlertService } from '../alert.service';
import { AlertResponseDto } from '../dtos/alert-response.dto';
import { makeAlertEntity } from './factories/alert.entity.factory';

describe('AlertController', () => {
  let alertController: AlertController;
  const alertServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
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
});
