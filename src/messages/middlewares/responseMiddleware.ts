import {
    Activity,
    ActivityTypes,
    TurnContext
} from 'botbuilder'
import { GoogleSheets } from 'src/core/google_sheets'

export class ResponseMiddleware {
    constructor(private readonly googleSheets: GoogleSheets) { }

    public async onTurn(turnContext: TurnContext, next: () => any) {
        if (turnContext.activity.type === ActivityTypes.Message) { }
        turnContext.onSendActivities(this.outgoingHandler.bind(this))
        await next()
    }

    public async outgoingHandler(turnContext: TurnContext, activities: Partial<Activity>[], next: () => any) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].type === ActivityTypes.Message) {
                if (activities[i].text.includes("[GUARDAR_RESERVA]")) {
                    this.googleSheets.Save(activities[i].text)
                    activities[i].text = "Muchas gracias por reservar con Innovators."
                }
            }
        }

        return await next()
    }
}
