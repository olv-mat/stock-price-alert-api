import { validate } from 'class-validator';
import { makeCreateAlertDto } from './factories/create-alert.dto.factory';

describe('CreateAlertDto', () => {
  it('should accept when is valid', async () => {
    const dto = makeCreateAlertDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('ticker', () => {
    it('should fail if is empty', async () => {
      const dto = makeCreateAlertDto({ ticker: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('ticker');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail if is not a string', async () => {
      const dto = makeCreateAlertDto({ ticker: undefined });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('ticker');
      expect(error.constraints).toHaveProperty('isString');
    });
  });

  describe('targetPrice', () => {
    it('should fail if is not a number', async () => {
      const dto = makeCreateAlertDto({ targetPrice: undefined });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('targetPrice');
      expect(error.constraints).toHaveProperty('isNumber');
    });

    it('should fail if is zero', async () => {
      const dto = makeCreateAlertDto({ targetPrice: 0 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('targetPrice');
      expect(error.constraints).toHaveProperty('isPositive');
    });

    it('should fail if is negative', async () => {
      const dto = makeCreateAlertDto({ targetPrice: -38.5 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('targetPrice');
      expect(error.constraints).toHaveProperty('isPositive');
    });
  });
});
