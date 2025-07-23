import {
  Controller,
  Get,
  Post,
  Body,
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
  GetInfoUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserQueryPhanTrangDto,
} from './dto/user.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
        avatar: {
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
  @Get('LayDanhSachNguoiDung')
  async getAllListUser(@Query() query: UserQueryDto) {
    return this.userService.getAllListUser(query);
  }

  @Public()
  @Get('LayDanhSachNguoiDungPhanTrang')
  async getAllListUserPhanTrang(@Query() query: UserQueryPhanTrangDto) {
    return this.userService.getAllListUserPhanTrang(query);
  }

  @ApiBearerAuth()
  @Get('TimKiemNguoiDung')
  async findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @ApiBearerAuth()
  @Get('TimKiemNguoiDungPhanTrang')
  async findAllPaginate(@Query() query: UserQueryPhanTrangDto) {
    return this.userService.findAllPaginate(query);
  }

  @ApiBearerAuth()
  @Get('ThongTinTaiKhoan')
  async getInfo(@User() user: NguoiDung) {
    return this.userService.getInfo(user);
  }

  @ApiBearerAuth()
  @Post('LayThongTinNguoiDung')
  async getInfoUser(@Query() query: GetInfoUserDto, @User() user: NguoiDung) {
    return await this.userService.getInfoUser(query, user);
  }

  //Them nguoi dung => admin add  user
  @ApiBearerAuth()
  @Post('ThemNguoiDung')
  async addUser(@Body() body: CreateUserDto, @User() user: NguoiDung) {
    return this.userService.addUser(body, user);
  }

  @ApiBearerAuth()
  @Put('CapNhatThongTinNguoiDung')
  async updateUser(@Body() body: UpdateUserDto) {
    return await this.userService.updateUser(body);
  }

  @ApiBearerAuth()
  @Post('CapNhatThongTinNguoiDung')
  async updateUserForAdmin(
    @Body() body: CreateUserDto,
    @User() user: NguoiDung,
  ) {
    return await this.userService.updateUserForAdmin(body, user);
  }

  @ApiBearerAuth()
  //Remove nguoi dung => admin remove user
  @Delete('XoaNguoiDung/:id')
  async removeUser(@Param('id') id: number, @User() user: NguoiDung) {
    return this.userService.removeUser(id, user);
  }
}
