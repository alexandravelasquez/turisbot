import {
    ActivityHandler,
    ConversationState,
    StatePropertyAccessor,
    TurnContext
} from 'botbuilder'
import { Dialog, DialogState } from 'botbuilder-dialogs'
import { MainDialog } from '../dialogs/main.dialog'

export class MainBot extends ActivityHandler {
    private conversationState: ConversationState
    private dialog: Dialog
    private dialogState: StatePropertyAccessor<DialogState>

    constructor(conversationState: ConversationState, dialog: Dialog) {
        super()

        this.conversationState = conversationState as ConversationState
        this.dialogState = this.conversationState.createProperty<DialogState>('DialogState')
        this.dialog = dialog

        this.onMessage(async (context, next) => {
            await (this.dialog as MainDialog).run(context, this.dialogState)
            await next()
        })
    }

    public async run(context: TurnContext): Promise<void> {
        await super.run(context)
        await this.conversationState.saveChanges(context)
    }
}