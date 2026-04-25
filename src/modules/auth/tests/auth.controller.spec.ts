import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { makeLoginDto } from './factories/login.dto.factory';

describe('AuthController', () => {
  let authController: AuthController;
  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authController = new AuthController(
      authServiceMock as unknown as AuthService,
    );
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const dto = makeLoginDto();
      authServiceMock.login.mockResolvedValue('');
      const response = await authController.login(dto);
      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(response instanceof LoginResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeLoginDto();
      authServiceMock.login.mockRejectedValue(new UnauthorizedException());
      await expect(authController.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    });
  });
});
