import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';

export const makeAccessTokenPayload = (
  override?: Partial<AccessTokenPayload>,
): AccessTokenPayload => {
  return Object.assign(new AccessTokenPayload(), {
    sub: '8ca0387e-9dc5-47e5-8bac-82463d9e612a',
    name: 'John Doe',
    email: 'john.doe@example.com',
    ...override,
  });
};
