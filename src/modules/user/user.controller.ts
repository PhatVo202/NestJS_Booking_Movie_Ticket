import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorator/user.decorator';
import { NguoiDung } from 'generated/prisma';
import { Public } from 'src/common/decorator/is-public.decorator';

@Controller('user-management')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Post('update-avatar')
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatarCloud(
    @UploadedFile() file: Express.Multer.File,
    @User() user: NguoiDung,
  ) {
    return this.userService.updateAvatarCloud(file, user);
  }

  @Public()
  @Get('list-user-type')
  async getListUserType() {
    return this.userService.getListUserType();
  }

  @Public()
  @ApiParam({
    name: 'tuKhoa',
    type: String,
    description: 'Từ Khoá theo họ tên',
  })
  @Get('LayDanhSachNguoiDung/:tuKhoa')
  async getAllListUser(@Query() query: string) {
    return this.userService.getAllListUser(query);
  }
}
