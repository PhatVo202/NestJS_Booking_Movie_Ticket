import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TicketManagementService } from './ticket-management.service';
import {
  BookTicketDto,
  CreateTicketManagementDto,
  GetListRoomTicketDto,
  ShowScheduleDto,
} from './dto/create-ticket-management.dto';
import { UpdateTicketManagementDto } from './dto/update-ticket-management.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { NguoiDung } from 'generated/prisma';
import { Public } from 'src/common/decorator/is-public.decorator';

@ApiTags('Quản Lý Đặt Vé')
@Controller('QuanLyDatVe')
export class TicketManagementController {
  constructor(
    private readonly ticketManagementService: TicketManagementService,
  ) {}

  @ApiBearerAuth()
  @Post('DatVe')
  async bookTicket(@Body() body: BookTicketDto, @User() user: NguoiDung) {
    return await this.ticketManagementService.bookTicket(body, user);
  }

  @Public()
  @Get('LayDanhSachPhongVe')
  async getListRoomTicket(@Query() query: GetListRoomTicketDto) {
    return await this.ticketManagementService.getListRoomTicket(query);
  }

  @ApiBearerAuth()
  @Post('TaoLichChieu')
  async createShowSchedule(
    @Body() body: ShowScheduleDto,
    @User() user: NguoiDung,
  ) {
    return await this.ticketManagementService.createShowSchedule(body, user);
  }
}
