import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CredentialService } from 'src/common/modules/credential/credential.service';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeCreateUserDto } from 'src/modules/user/tests/factories/create-user.dto.factory';
import { makeUserEntity } from 'src/modules/user/tests/factories/user.entity.factory';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';
import { makeLoginDto } from './factories/login.dto.factory';

type AuthServiceContext = {
  authService: AuthService;
  userServiceMock: UserService;
  credentialServiceMock: CredentialService;
  cryptographyServiceMock: CryptographyService;
};

describe('AuthService', () => {
  let context: AuthServiceContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CredentialService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: CryptographyService,
          useValue: {
            compare: jest.fn(),
          },
        },
      ],
    }).compile();
    context = {
      authService: module.get(AuthService),
      userServiceMock: module.get(UserService),
      credentialServiceMock: module.get(CredentialService),
      cryptographyServiceMock: module.get(CryptographyService),
    };
  });

  describe('login', () => {
    it('should authenticate an user and return an access token', async () => {
      const {
        authService,
        userServiceMock,
        credentialServiceMock,
        cryptographyServiceMock,
      } = context;
      const dto = makeLoginDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const spies = {
        findByEmail: jest
          .spyOn(userServiceMock, 'findByEmail')
          .mockResolvedValue(userEntity),
        compare: jest
          .spyOn(cryptographyServiceMock, 'compare')
          .mockResolvedValue(true),
        sign: jest
          .spyOn(credentialServiceMock, 'sign')
          .mockResolvedValue(token),
      };
      const response = await authService.login(dto);
      expect(spies.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(spies.compare).toHaveBeenCalledWith(
        dto.password,
        userEntity.password,
      );
      expect(spies.sign).toHaveBeenCalledWith({
        sub: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
      });
      expect(response).toEqual({
        userEntity,
        token,
      });
    });

    it('should throw an unauthorized exception when user not found', async () => {
      const {
        authService,
        userServiceMock,
        credentialServiceMock,
        cryptographyServiceMock,
      } = context;
      const dto = makeLoginDto();
      const spies = {
        findByEmail: jest
          .spyOn(userServiceMock, 'findByEmail')
          .mockResolvedValue(null),
        compare: jest.spyOn(cryptographyServiceMock, 'compare'),
        sign: jest.spyOn(credentialServiceMock, 'sign'),
      };
      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(spies.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(spies.compare).not.toHaveBeenCalled();
      expect(spies.sign).not.toHaveBeenCalled();
    });

    it('should throw an unauthorized exception when password is incorrect', async () => {
      const {
        authService,
        userServiceMock,
        credentialServiceMock,
        cryptographyServiceMock,
      } = context;
      const dto = makeLoginDto();
      const userEntity = makeUserEntity();
      const spies = {
        findByEmail: jest
          .spyOn(userServiceMock, 'findByEmail')
          .mockResolvedValue(userEntity),
        compare: jest
          .spyOn(cryptographyServiceMock, 'compare')
          .mockResolvedValue(false),
        sign: jest.spyOn(credentialServiceMock, 'sign'),
      };
      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(spies.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(spies.compare).toHaveBeenCalledWith(
        dto.password,
        userEntity.password,
      );
      expect(spies.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register an user and return an access token', async () => {
      const { authService, userServiceMock, credentialServiceMock } = context;
      const dto = makeCreateUserDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const spies = {
        create: jest
          .spyOn(userServiceMock, 'create')
          .mockResolvedValue(userEntity),
        sign: jest
          .spyOn(credentialServiceMock, 'sign')
          .mockResolvedValue(token),
      };
      const response = await authService.register(dto);
      expect(spies.create).toHaveBeenCalledWith(dto);
      expect(spies.sign).toHaveBeenCalledWith({
        sub: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
      });
      expect(response).toEqual({
        userEntity,
        token,
      });
    });

    it('should propagate service exceptions', async () => {
      const { authService, userServiceMock } = context;
      const dto = makeCreateUserDto();
      const spy = jest
        .spyOn(userServiceMock, 'create')
        .mockRejectedValue(new ConflictException());
      await expect(authService.register(dto)).rejects.toThrow(
        ConflictException,
      );
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});
