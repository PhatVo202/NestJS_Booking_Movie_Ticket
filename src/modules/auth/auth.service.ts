import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async login(body: LoginDto) {
    const { tai_khoan, mat_khau } = body;

    const userExist = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: tai_khoan,
      },
    });

    if (!userExist) {
      throw new BadRequestException('Tài khoản không hợp lệ');
    }

    if (!userExist.mat_khau) {
      throw new BadRequestException('Cần đăng nhập MXH để có password');
    }

    const isPassword = bcrypt.compare(mat_khau, userExist.mat_khau);

    if (!isPassword) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    const token = this.tokenService.createToken(userExist.id);
    return token;
  }

  async register(body: RegisterDto) {
    console.log({ body: body });
    const { tai_khoan, mat_khau, ho_ten, email, so_dt } = body;

    const userExits = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: tai_khoan,
      },
    });

    if (userExits) {
      throw new BadRequestException('Tài khoản đã tồn tại! Hãy đăng nhập');
    }

    const hashPassword = await bcrypt.hash(mat_khau, 10);

    const user = await this.prisma.nguoiDung.create({
      data: {
        tai_khoan: tai_khoan,
        mat_khau: hashPassword,
        ho_ten: ho_ten,
        email: email,
        so_dt: so_dt,
        loai_nguoi_dung: 'KhachHang',
      },
    });

    const { mat_khau: _, ...safeUser } = user;
    return safeUser;
  }

  async refreshToken(body: RefreshTokenDto) {
    const { accessToken, refreshToken } = body;
    console.log({ accessToken: accessToken, refreshToken: refreshToken });

    const decodeRefreshToken =
      this.tokenService.verifyRefreshToken(refreshToken);
    const decodeAccessToken = this.tokenService.verifyAccessToken(
      accessToken,
      true,
    );
    if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
      throw new UnauthorizedException('Refresh Token không thành công');
    }
    const tokens = this.tokenService.createToken(decodeRefreshToken.userId);
    return tokens;
  }
}
