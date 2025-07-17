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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UserQueryDto,
  UserQueryPhanTrangDto,
} from './dto/user.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorator/user.decorator';
import { NguoiDung } from 'generated/prisma';
import { Public } from 'src/common/decorator/is-public.decorator';

@ApiTags('Quản Lý Người Dùng')
@Controller('QuanLyNguoiDung')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Post('CapNhatAvaTar')
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
  @Get('LayDanhSachLoaiNguoiDung')
  async getListUserType() {
    return this.userService.getListUserType();
  }

  @Public()
  @ApiParam({
    name: 'tuKhoa',
    type: String,
    description: 'Từ Khoá theo họ tên & id',
  })
  @Get('LayDanhSachNguoiDung')
  async getAllListUser(@Query() query: UserQueryDto) {
    return this.userService.getAllListUser(query);
  }

  @Public()
  @Get('LayDanhSachNguoiDungPhanTrang')
  async getAllListUserPhanTrang(@Query() query: UserQueryPhanTrangDto) {
    return this.userService.getAllListUserPhanTrang(query);
  }

  @Get('ThongTinTaiKhoan')
  async getInfo(@User() user: NguoiDung) {
    return this.userService.getInfo(user);
  }

  //Them nguoi dung => admin add  user
  @Post('ThemNguoiDung')
  async addUser(@Body() body: CreateUserDto, @User() user: NguoiDung) {
    return this.userService.addUser(body, user);
  }

  @Put('CapNhatThongTinNguoiDung')
  async updateUser() {
    return;
  }

  //Remove nguoi dung => admin remove user
  @Delete('XoaNguoiDung/:id')
  async removeUser(@Param('id') id: number, @User() user: NguoiDung) {
    return this.userService.removeUser(id, user);
  }
}
