import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TokenModule } from './modules/token/token.module';
import { ProtectStrategy } from './modules/auth/protect/protect.strategy';
import { FilmManagementModule } from './modules/film-management/film-management.module';
import { TheaterManagementModule } from './modules/theater-management/theater-management.module';
import { TicketManagementModule } from './modules/ticket-management/ticket-management.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    TokenModule,
    FilmManagementModule,
    TheaterManagementModule,
    TicketManagementModule,
  ],
  controllers: [],
  providers: [AppService, ProtectStrategy],
})
export class AppModule {}
