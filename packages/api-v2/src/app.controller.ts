import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@ApiTags('Index')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOkResponse({ description: 'Gets simple message' })
    getIndexRoute(_: Request, @Res() res: Response) {
        res.json({
            version: 2,
            message: this.appService.getIndexMessage()
        });
    }
}
