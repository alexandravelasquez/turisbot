import {
    Activity,
    ActivityTypes,
    TurnContext
} from 'botbuilder'

export class ResponseMiddleware {
    constructor() { }

    public async onTurn(turnContext: TurnContext, next: () => any) {
        if (turnContext.activity.type === ActivityTypes.Message) { }
        turnContext.onSendActivities(this.outgoingHandler.bind(this))
        await next()
    }

    public async outgoingHandler(turnContext: TurnContext, activities: Partial<Activity>[], next: () => any) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].type === ActivityTypes.Message) { }
        }

        return await next()
    }
}
