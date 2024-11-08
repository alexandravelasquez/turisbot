import { Activity, Attachment } from 'botbuilder'
import { WhatsAppExternalService } from 'src/core/channels'
import { MetaResponse } from '../interfaces/metaResponse'
import {
    ContactsMessage,
    DocumentMessage,
    LinkMessage,
    ListMessage,
    LocationMessage,
    RepliesMessage,
    TextMessage,
    VideoMessage
} from 'src/core/channels/whatsapp/models'

export class WhatsAppHelper {
    private to: string

    constructor(private readonly whatsAppExternalService: WhatsAppExternalService) { }

    async sendMessage(activity: Partial<Activity>): Promise<MetaResponse> {
        this.to = activity.recipient.id

        if (activity.suggestedActions !== undefined) {
            if (activity.suggestedActions.actions.length > 3)
                return await this.sendListMessage(activity)

            return await this.sendRepliesMessage(activity)
        }

        if (activity.attachments !== undefined)
            return await this.sendAttachment(activity)

        return await this.sendTextMessage(activity)
    }

    private async sendTextMessage(activity: Partial<Activity>): Promise<MetaResponse> {
        const textMessage: TextMessage = {
            text: activity.text,
            preview_url: false
        }

        return await this.whatsAppExternalService.sendTextMessage(this.to, textMessage)
    }

    private async sendAttachment(activity: Partial<Activity>): Promise<MetaResponse> {
        if (activity.attachments.length > 1)
            throw new Error(`WhatsAppHelper.sendAttachment(): Attachments must have one item.`)

        const attachment = activity.attachments[0]
        switch (attachment.contentType) {
            case 'image':
                return await this.sendImageMessage(attachment.contentUrl)
            case 'audio':
                return await this.sendAudioMessage(attachment.contentUrl)
            case 'sticker':
                return await this.sendStickerMessage(attachment.contentUrl)
            case 'document':
                return await this.sendDocumentMessage(attachment)
            case 'video':
                return await this.sendVideoMessage(attachment)
            case 'contacts':
                return await this.sendContactsMessage(attachment.content)
            case 'location':
                return await this.sendLocationMessage(attachment.content)
            case 'list':
                return await this.sendListMessage(attachment.content)
            default:
                throw new Error(`WhatsAppHelper.sendAttachment(): Attachments of type '${attachment.contentType}' aren't supported.`)
        }
    }

    private async sendImageMessage(url: string): Promise<MetaResponse> {
        const linkMessage: LinkMessage = {
            link: url
        }

        return this.whatsAppExternalService.sendImageMessage(this.to, linkMessage)
    }

    private async sendAudioMessage(url: string): Promise<MetaResponse> {
        const linkMessage: LinkMessage = {
            link: url
        }

        return this.whatsAppExternalService.sendAudioMessage(this.to, linkMessage)
    }

    private async sendStickerMessage(url: string): Promise<MetaResponse> {
        const linkMessage: LinkMessage = {
            link: url
        }

        return this.whatsAppExternalService.sendStickerMessage(this.to, linkMessage)
    }

    private async sendDocumentMessage(attachment: Attachment): Promise<MetaResponse> {
        const documentMessage: DocumentMessage = {
            link: attachment.contentUrl,
            filename: attachment.name,
            caption: attachment.content
        }

        return this.whatsAppExternalService.sendDocumentMessage(this.to, documentMessage)
    }

    private async sendVideoMessage(attachment: Attachment): Promise<MetaResponse> {
        const videoMessage: VideoMessage = {
            link: attachment.contentUrl,
            caption: attachment.content
        }

        return this.whatsAppExternalService.sendVideoMessage(this.to, videoMessage)
    }

    private async sendContactsMessage(content: ContactsMessage): Promise<MetaResponse> {
        const contactsMessage: ContactsMessage = {
            addresses: content.addresses,
            birthday: content.birthday,
            emails: content.emails,
            name: content.name,
            org: content.org,
            phones: content.phones,
            urls: content.urls
        }

        return this.whatsAppExternalService.sendContactsMessage(this.to, contactsMessage)
    }

    private async sendLocationMessage(content: LocationMessage): Promise<MetaResponse> {
        const locationMessage: LocationMessage = {
            latitude: content.latitude,
            longitude: content.longitude,
            name: content.name,
            address: content.address
        }

        return this.whatsAppExternalService.sendLocationMessage(this.to, locationMessage)
    }

    private async sendListMessage(activity: Partial<Activity>): Promise<MetaResponse> {
        var rows = []
        for (let i = 0; i < activity.suggestedActions.actions.length; i++) {
            rows.push({
                id: activity.suggestedActions.actions[i].title,
                title: activity.suggestedActions.actions[i].displayText
            })
        }

        const listMessage: ListMessage = {
            type: "list",
            body: {
                text: activity.text
            },
            footer: {
                text: "Por favor, elige una opción"
            },
            action: {
                button: "Seleccionar",
                sections: [{ rows }]
            }
        }

        return this.whatsAppExternalService.sendListMessage(this.to, listMessage)
    }

    private async sendRepliesMessage(activity: Partial<Activity>): Promise<MetaResponse> {
        var buttons = []
        for (let i = 0; i < activity.suggestedActions.actions.length; i++) {
            buttons.push({
                type: "reply",
                reply: {
                    id: activity.suggestedActions.actions[i].title,
                    title: activity.suggestedActions.actions[i].displayText
                }
            })
        }

        const repliesMessage: RepliesMessage = {
            type: "button",
            body: {
                text: activity.text
            },
            action: {
                buttons: buttons
            }
        }

        return this.whatsAppExternalService.sendRepliesMessage(this.to, repliesMessage)
    }
}
