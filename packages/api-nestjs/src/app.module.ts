import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { ClientRequestModule } from './client-requests/client-requests.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        PrismaModule,
        ItemsModule,
        NotesModule,
        UsersModule,
        UtilsModule,
        ClientRequestModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
