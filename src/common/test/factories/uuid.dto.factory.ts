import { UuidDto } from 'src/common/dtos/uuid.dto';

export const makeUuidDto = (ovverride?: Partial<UuidDto>): UuidDto => {
  return Object.assign(new UuidDto(), {
    id: '27d00cd0-31c8-4630-9e4f-e2f890689a73',
    ...ovverride,
  });
};
