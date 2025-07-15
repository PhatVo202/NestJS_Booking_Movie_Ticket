import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constants/app.constant';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET || 'Chưa có token',
    });
  }

  async validate(payload: any) {
    console.log({ payload: payload });
    const user = await this.prisma.nguoiDung.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không hợp lệ');
    }

    const { mat_khau, ...safeUser } = user;
    console.log({ safeUser: safeUser });

    return safeUser;
  }
}
