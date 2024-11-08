import { Activity, ActivityTypes } from 'botbuilder'
import { RequestInterface } from '../interfaces/requestInterface'
import { ConversationFactory } from '../../../factories/conversationFactory'
import { ConfigService } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'

export class ActivityHelper {
    private static readonly channel: string = 'whatsapp-cloud-api'
    constructor() { }

    static payloadToActivity(configService: ConfigService, message: RequestInterface): Partial<Activity> {
        var activity: Partial<Activity> = {
            id: message?.entry[0].changes[0].value.messages[0].id,
            timestamp: new Date(),
            channelId: this.channel,
            conversation: {
                id: ConversationFactory.getConversationId(message?.entry[0].changes[0].value.contacts[0].wa_id),
                isGroup: false,
                conversationType: null,
                tenantId: null,
                name: this.channel
            },
            from: {
                id: message?.entry[0].changes[0].value.contacts[0].wa_id,
                name: message?.entry[0].changes[0].value.contacts[0].profile.name,
                role: 'user'
            },
            recipient: {
                id: configService.get('WhatsAppPhoneNumber'),
                name: 'Bot',
                role: 'bot'
            },
            text: message?.entry[0].changes[0].value.messages[0].text.body,
            attachments: [],
            channelData: null,
            localTimezone: 'es-ES',
            callerId: null,
            serviceUrl: null,
            listenFor: null,
            label: null,
            valueType: null,
            type: null
        }

        activity = this.getMessageType(activity, message)
        return activity
    }

    static getMessageType(activity: Partial<Activity>, message: RequestInterface): Partial<Activity> {
        if (message?.entry[0]?.changes[0]?.value?.messages[0]?.text?.body) {
            activity.type = ActivityTypes.Message
            return activity
        }

        throw new BadRequestException('Method not supported by WhatsApp Cloud API.')
    }
}
