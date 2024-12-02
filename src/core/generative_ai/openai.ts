import OpenAI from 'openai'
import { ConfigService } from "@nestjs/config"
import { WaterfallStepContext } from "botbuilder-dialogs"

export class OpenAIGenerator {
    constructor(private readonly configService: ConfigService) { }

    async GetAnswers(stepContext: WaterfallStepContext): Promise<string> {
        const client = new OpenAI({
            apiKey: this.configService.get('OpenAIToken')
        });

        const chatCompletion = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: this.configService.get('OPENAI_PROMPT')
                },
                {
                    role: 'assistant',
                    content: 'OK'
                },
                {
                    role: 'user',
                    content: stepContext.context.activity.text
                }
            ]
        })

        return chatCompletion.choices[0].message.content
    }
}