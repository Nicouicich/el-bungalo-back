import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSessionDto } from '@libs/dto/auth/user-session.dto';
import { CreateUserInputDto } from '@libs/dto/user/create-user-input.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const usersServiceMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user', async () => {
    const user = {
      id: '1',
      username: 'test',
      password: await bcrypt.hash('password', 10),
      email: 'test@test.com',
      name: 'test',
      lastName: 'User',
      createdAt: new Date(),
      admin: false,
      hashPassword: async () => {},
    };
    const input = { username: 'test', password: 'password' };

    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    expect(await service.validateUser(input.username, input.password)).toEqual({
      id: '1',
      username: 'test',
      email: 'test@test.com',
      name: 'test',
      lastName: 'User',
      admin: false,
      createdAt: user.createdAt,
      hashPassword: expect.any(Function),
    });
  });

  it('should return null if user validation fails', async () => {
    const input = { username: 'usertest', password: 'password' };

    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    expect(
      await service.validateUser(input.username, input.password),
    ).toBeNull();
  });

  it('should sign JWT for user', async () => {
    const user: UserSessionDto = { id: 'id', username: 'test' }; // Change this line
    const token = 'token';

    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    expect(service.signJwt(user)).toEqual({ access_token: token });
  });

  it('should sign up user', async () => {
    const input: CreateUserInputDto = {
      username: 'test',
      password: 'password',
      email: 'test@test.com',
      name: 'Test',
      lastName: 'User',
    };

    jest.spyOn(usersService, 'create').mockResolvedValue(undefined);

    await service.signUp(input);

    expect(usersService.create).toHaveBeenCalledWith(input);
  });
});
