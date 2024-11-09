import {
    Inject,
    Injectable,
    Query
} from '@nestjs/common'
import {
    ConversationState,
    Request,
    Response
} from 'botbuilder'
import { MainBot } from './bots/mainBot'
import { Adapters } from '../core/adapters'
import { ConfigService } from '@nestjs/config'
import { MainDialog } from './dialogs/main.dialog'
import { WhatsAppExternalService } from 'src/core/channels'
import { Webhook } from 'src/core/channels/whatsapp/interfaces/webhook'
import { OpenAIGenerator } from 'src/core/generative_ai/openai'

@Injectable()
export class MessagesService {
    private adapters: Adapters
    private bot: MainBot

    constructor(
        private readonly configService: ConfigService,
        @Inject('ConversationState') private readonly conversationState: ConversationState,
        @Inject('WhatsAppExternalService') private readonly whatsAppExternalService: WhatsAppExternalService) {
        this.adapters = new Adapters(
            this.configService,
            this.whatsAppExternalService
        )

        this.bot = new MainBot(
            this.conversationState,
            new MainDialog(new OpenAIGenerator(this.configService)))
    }

    async processDefaultMessageAsync(req: Request, res: Response) {
        return await this.adapters.DefaultAdapter().process(req, res, (context) => this.bot.run(context))
    }

    async verifyWhatsAppWebhook(@Query() query: Webhook) {
        return await this.whatsAppExternalService.verifyWebhook(query)
    }

    async processWhatsAppMessageAsync(req: Request, res: Response) {
        return await this.adapters.WhatsAppAdapter().process(req, res, (context) => this.bot.run(context))
    }
}
