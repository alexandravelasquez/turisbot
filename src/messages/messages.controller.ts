import {
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res
} from '@nestjs/common'
import { Request, Response } from 'botbuilder'
import { MessagesService } from './messages.service'
import { Webhook } from 'src/core/channels/whatsapp/interfaces/webhook'

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Post()
    async DefaultAdapter(@Req() req: Request, @Res() res: Response) {
        await this.messagesService.processDefaultMessageAsync(req, res)
    }

    @Get('/whatsapp')
    async WhatsAppAdapterGet(@Query() query: Webhook) {
        return await this.messagesService.verifyWhatsAppWebhook(query)
    }

    @Post('/whatsapp')
    async WhatsAppAdapter(@Req() req: Request, @Res() res: Response) {
        await this.messagesService.processWhatsAppMessageAsync(req, res)
    }
}
