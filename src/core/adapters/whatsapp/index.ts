import { CustomWebAdapter } from '@botbuildercommunity/core'
import {
    Activity,
    ActivityTypes,
    ConversationReference,
    ResourceResponse,
    TurnContext,
    WebRequest,
    WebResponse
} from 'botbuilder'
import { ActivityHelper } from './helpers/activityHelper'
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WhatsAppExternalService } from 'src/core/channels'
import { MetaResponse } from './interfaces/metaResponse'
import { WhatsAppHelper } from './helpers/whatsappHelper'

export class WhatsAppAdapter extends CustomWebAdapter {
    private readonly whatsAppHelper: WhatsAppHelper

    public constructor(private readonly configService: ConfigService, private readonly whatsAppExternalService: WhatsAppExternalService) {
        super()
        this.whatsAppHelper = new WhatsAppHelper(whatsAppExternalService)
    }

    public async sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]> {
        const responses: ResourceResponse[] = []

        for (let i = 0; i < activities.length; i++) {
            const activity: Partial<Activity> = activities[i]
            switch (activity.type) {
                case ActivityTypes.Message:
                    try {
                        const res: MetaResponse = await this.whatsAppHelper.sendMessage(activity)
                        responses.push({ id: res.messages[0].id })
                    } catch (error) {
                        throw new Error(`WhatsAppAdapter.sendActivities(): ${error.message}.`)
                    }

                    break
                default:
                    responses.push({} as ResourceResponse)
                    throw new Error(`WhatsAppAdapter.sendActivities(): Activities of type '${activity.type}' aren't supported.`)
            }
        }

        return responses
    }

    public async updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void> {
        throw new Error('Method not supported by WhatsApp Cloud API.')
    }

    public async deleteActivity(context: TurnContext, conversationReference: Partial<ConversationReference>): Promise<void> {
        throw new Error('Method not supported by WhatsApp Cloud API.')
    }

    public async continueConversation(conversationReference: Partial<ConversationReference>, logic: (context: TurnContext) => Promise<void>): Promise<void> {
        const request: Partial<Activity> = TurnContext.applyConversationReference(
            {
                type: 'event',
                name: 'continueConversation'
            },
            conversationReference,
            true
        )

        const context: TurnContext = this.createContext(request)
        return this.runMiddleware(context, logic)
    }

    public async process(req: WebRequest, res: WebResponse, logic: (context: TurnContext) => Promise<any>): Promise<void> {
        const { body } = req
        if (!body?.entry?.[0]?.changes?.[0]?.value?.messages)
            this.handleBadRequest(res, 'El cuerpo del request no es un mensaje.')

        if (!req?.headers?.['x-hub-signature-256'])
            this.handleBadRequest(res, 'El header x-hub-signature-256 es requerido.')

        //await this.whatsAppExternalService.verifySignature(req.headers['x-hub-signature-256'], body)

        let activity = ActivityHelper.payloadToActivity(this.configService, body)
        const context: TurnContext = this.createContext(activity)

        context.turnState.set('httpStatus', 200)
        await this.runMiddleware(context, logic)

        res.status(200)
        res.end()
        return
    }

    private handleBadRequest(res: WebResponse, message: string) {
        res.status(200)
        res.end()
        throw new BadRequestException(message)
    }

    protected createContext(request: Partial<Activity>): TurnContext {
        return new TurnContext(this as any, request)
    }
}
