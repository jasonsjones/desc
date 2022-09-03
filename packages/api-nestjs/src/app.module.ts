import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
    imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, UtilsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
