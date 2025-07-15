import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorator/is-public.decorator';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('user-management')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Request() req: any) {
    return await this.authService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body);
  }
}
