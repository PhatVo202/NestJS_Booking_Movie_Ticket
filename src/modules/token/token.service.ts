import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constants/app.constant';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}
  createToken(userId) {
    const accessToken = this.jwt.sign(
      { userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES,
        secret: ACCESS_TOKEN_SECRET,
      },
    );
    const refreshToken = this.jwt.sign(
      { userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
        secret: REFRESH_TOKEN_SECRET,
      },
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token, ignoreExpiration = false) {
    return this.jwt.verify(token, {
      secret: ACCESS_TOKEN_SECRET,
      ignoreExpiration: ignoreExpiration,
    });
  }

  verifyRefreshToken(token) {
    return this.jwt.verify(token, {
      secret: REFRESH_TOKEN_SECRET,
    });
  }
}
