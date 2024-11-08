import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { ConversationState, MemoryStorage } from 'botbuilder'
import { WhatsAppExternalService } from 'src/core/channels'
import { ConfigService } from '@nestjs/config'
import { MetaService } from 'src/core/channels/whatsapp/request'

@Module({
  imports: [HttpModule],
  controllers: [MessagesController],
  providers: [MessagesService,
    {
      provide: 'ConversationState',
      useFactory: () => {
        const memoryStorage = new MemoryStorage()
        return new ConversationState(memoryStorage)
      }
    },
    {
      provide: 'WhatsAppExternalService',
      useFactory: (
        httpService: HttpService,
        configService: ConfigService) => {
        const metaService = new MetaService(httpService, configService)
        return new WhatsAppExternalService(
          httpService,
          configService,
          metaService)
      },
      inject: [HttpService, ConfigService]
    }]
})

export class MessagesModule { }
