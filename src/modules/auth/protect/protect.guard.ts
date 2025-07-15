import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';

@Injectable()
export class ProtectGuard extends AuthGuard('protect') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || info) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException('Token hết hạn'); //403 => FE sẽ refreshToken
      }

      if (info instanceof UnauthorizedException) {
        throw new UnauthorizedException('Token không hợp lệ'); //401 => FE sẽ logout
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
