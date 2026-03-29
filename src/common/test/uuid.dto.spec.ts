import { validate } from 'class-validator';
import { makeUuidDto } from './factories/uuid.dto.factory';

describe('UuidDto', () => {
  it('should accept when is valid', async () => {
    const dto = makeUuidDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('id', () => {
    it('should fail if is not a valid uuid', async () => {
      const dto = makeUuidDto({ id: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toEqual('id');
      expect(error.constraints).toHaveProperty('isUuid');
    });
  });
});
