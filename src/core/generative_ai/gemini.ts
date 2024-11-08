import { EnhancedGenerateContentResponse, GoogleGenerativeAI } from "@google/generative-ai"
import { ConfigService } from "@nestjs/config"
import { WaterfallStepContext } from "botbuilder-dialogs"

export class GeminiAI {
    constructor(private readonly configService: ConfigService) { }

    async GetAnswers(stepContext: WaterfallStepContext): Promise<string> {
        const genAI = new GoogleGenerativeAI(this.configService.get('GeminiToken'))
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: 'OK' }]
                },
                {
                    role: "model",
                    parts: [{ text: "OK" }]
                }
            ]
        })

        const result: EnhancedGenerateContentResponse = (await chat.sendMessage(stepContext.context.activity.text)).response

        return result.text()
    }
}