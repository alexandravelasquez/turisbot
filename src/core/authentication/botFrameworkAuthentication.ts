import { ConfigService } from '@nestjs/config';
import {
    ConfigurationBotFrameworkAuthentication,
    ConfigurationBotFrameworkAuthenticationOptions
} from 'botbuilder';

export class BotFrameworkAuthentication {
    constructor(private readonly configService: ConfigService) { }

    GetConfiguration(): ConfigurationBotFrameworkAuthentication {
        const credentials = {
            MicrosoftAppId: this.configService.get<string>('MicrosoftAppId'),
            MicrosoftAppPassword: this.configService.get<string>('MicrosoftAppPassword'),
            MicrosoftAppTenantId: this.configService.get<string>('MicrosoftAppTenantId')
        }

        return new ConfigurationBotFrameworkAuthentication(credentials as ConfigurationBotFrameworkAuthenticationOptions)
    }
}