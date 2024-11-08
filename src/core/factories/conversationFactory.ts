import { Guid } from 'guid-typescript'

export class ConversationFactory {
    private static conversations: {
        [userId: string]: {
            conversationId: string
            createdTime: number
        }
    } = {}

    constructor() { }

    static getConversationId(userId: string): string {
        if (userId in this.conversations) {
            const { createdTime } = this.conversations[userId]
            if (Date.now() - createdTime >= 3600000) {
                this.conversations[userId] = {
                    conversationId: Guid.create().toString(),
                    createdTime: Date.now()
                }
            }
        } else {
            this.conversations[userId] = {
                conversationId: Guid.create().toString(),
                createdTime: Date.now()
            }
        }

        return this.conversations[userId].conversationId
    }
}