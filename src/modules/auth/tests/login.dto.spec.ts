import { validate } from 'class-validator';
import { makeLoginDto } from './factories/login.dto.factory';

describe('LoginDto', () => {
  it('should accept when is valid', async () => {
    const dto = makeLoginDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('email', () => {
    it('should fail if is not a email', async () => {
      const dto = makeLoginDto({ email: 'john.doe' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('email');
      expect(error.constraints).toHaveProperty('isEmail');
    });

    it('should fail if is empty', async () => {
      const dto = makeLoginDto({ email: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('email');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('password', () => {
    it('should fail if is not a string', async () => {
      const dto = makeLoginDto({ password: undefined });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('password');
      expect(error.constraints).toHaveProperty('isString');
    });

    it('should fail if is empty', async () => {
      const dto = makeLoginDto({ password: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('password');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
