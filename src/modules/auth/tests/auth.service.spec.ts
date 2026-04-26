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
  userService: UserService;
  credentialService: CredentialService;
  cryptographyService: CryptographyService;
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
      userService: module.get(UserService),
      credentialService: module.get(CredentialService),
      cryptographyService: module.get(CryptographyService),
    };
  });

  describe('login', () => {
    it('should authenticate a user and return an access token', async () => {
      const {
        authService,
        userService,
        credentialService,
        cryptographyService,
      } = context;
      const dto = makeLoginDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const spies = {
        findByEmail: jest
          .spyOn(userService, 'findByEmail')
          .mockResolvedValue(userEntity),
        compare: jest
          .spyOn(cryptographyService, 'compare')
          .mockResolvedValue(true),
        sign: jest.spyOn(credentialService, 'sign').mockResolvedValue(token),
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

    it('should throw a unauthorized exception when user not found', async () => {
      const {
        authService,
        userService,
        credentialService,
        cryptographyService,
      } = context;
      const dto = makeLoginDto();
      const spies = {
        findByEmail: jest
          .spyOn(userService, 'findByEmail')
          .mockResolvedValue(null),
        compare: jest.spyOn(cryptographyService, 'compare'),
        sign: jest.spyOn(credentialService, 'sign'),
      };
      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(spies.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(spies.compare).not.toHaveBeenCalled();
      expect(spies.sign).not.toHaveBeenCalled();
    });

    it('should throw a unauthorized exception when password is incorrect', async () => {
      const {
        authService,
        userService,
        credentialService,
        cryptographyService,
      } = context;
      const dto = makeLoginDto();
      const userEntity = makeUserEntity();
      const spies = {
        findByEmail: jest
          .spyOn(userService, 'findByEmail')
          .mockResolvedValue(userEntity),
        compare: jest
          .spyOn(cryptographyService, 'compare')
          .mockResolvedValue(false),
        sign: jest.spyOn(credentialService, 'sign'),
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
    it('should register a user and return an access token', async () => {
      const { authService, userService, credentialService } = context;
      const dto = makeCreateUserDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const spies = {
        create: jest.spyOn(userService, 'create').mockResolvedValue(userEntity),
        sign: jest.spyOn(credentialService, 'sign').mockResolvedValue(token),
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
      const { authService, userService } = context;
      const dto = makeCreateUserDto();
      const spy = jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new ConflictException());
      await expect(authService.register(dto)).rejects.toThrow(
        ConflictException,
      );
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});
