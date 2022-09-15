import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaTestService } from './prisma-test.service';
import { PrismaService } from './prisma.service';

const prismaServiceProvider = {
    provide: PrismaService,
    useClass: process.env.NODE_ENV === 'test' ? PrismaTestService : PrismaService
};

@Module({
    imports: [ConfigModule],
    providers: [prismaServiceProvider],
    exports: [PrismaService]
})
export class PrismaModule {}
