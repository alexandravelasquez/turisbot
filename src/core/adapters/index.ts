import { CloudAdapter, TurnContext } from 'botbuilder'
import { ResponseMiddleware } from '../../messages/middlewares/responseMiddleware'
import { ConfigService } from '@nestjs/config'
import { BotFrameworkAuthentication } from '../authentication/botFrameworkAuthentication'
import { WhatsAppAdapter } from './whatsapp'
import { WhatsAppExternalService } from '../channels'
import { TextMessage } from '../channels/whatsapp/models'

export class Adapters {
    private readonly errorMessage: string = '¡Mil disculpas, ocurrió un problema en el servicio! 🤖 Ya estamos trabajando para solucionarlo. 😄'

    constructor(
        private readonly configService: ConfigService,
        private readonly whatsAppExternalService: WhatsAppExternalService) { }

    DefaultAdapter(): CloudAdapter {
        const adapter = new CloudAdapter(new BotFrameworkAuthentication(this.configService).GetConfiguration())
        adapter.use(new ResponseMiddleware())
        adapter.onTurnError = async (context: TurnContext, error: Error) => {
            await context.sendTraceActivity(
                'OnTurnError Trace',
                error,
                'https://www.botframework.com/schemas/error',
                'TurnError')
            await context.sendActivity(this.errorMessage)
        }

        return adapter
    }

    WhatsAppAdapter(): WhatsAppAdapter {
        const adapter = new WhatsAppAdapter(this.configService, this.whatsAppExternalService)
        adapter.use(new ResponseMiddleware())
        adapter.onTurnError = async (context: TurnContext, error: Error) => {
            const textMessage: TextMessage = {
                text: this.errorMessage,
                preview_url: false
            }

            await this.whatsAppExternalService.sendTextMessage(context.activity.from.id, textMessage)
        }

        return adapter
    }
}
