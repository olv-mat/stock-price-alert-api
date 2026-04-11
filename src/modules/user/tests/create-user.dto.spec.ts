import { validate } from 'class-validator';
import { makeCreateUserDto } from './factories/create-user.dto.factory';

describe('CreateUserDto', () => {
  it('should accept when is valid', async () => {
    const dto = makeCreateUserDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name', () => {
    it('should fail if is not a string', async () => {
      const dto = makeCreateUserDto({ name: undefined });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('name');
      expect(error.constraints).toHaveProperty('isString');
    });

    it('should fail if is empty', async () => {
      const dto = makeCreateUserDto({ name: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('name');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('email', () => {
    it('should fail if is not a email', async () => {
      const dto = makeCreateUserDto({ email: 'john.doe' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('email');
      expect(error.constraints).toHaveProperty('isEmail');
    });

    it('should fail if is empty', async () => {
      const dto = makeCreateUserDto({ email: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('email');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('password', () => {
    it('should fail if is not strong', async () => {
      const dto = makeCreateUserDto({ password: '123' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('password');
      expect(error.constraints).toHaveProperty('isStrongPassword');
    });

    it('should fail if is empty', async () => {
      const dto = makeCreateUserDto({ password: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('password');
      expect(error.constraints).toHaveProperty('isNotEmpty');
    });
  });
});
