import { UserSessionDto } from '@libs/dto/auth/user-session.dto';
import Request from 'express';

export interface IRequest extends Request {
  user: UserSessionDto;
}
