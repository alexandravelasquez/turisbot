import { StatePropertyAccessor, TurnContext } from 'botbuilder'
import {
    ComponentDialog,
    DialogContext,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs'
import { Dialogs } from '../common/dialogs'

export class MainDialog extends ComponentDialog {
    constructor() {
        super(Dialogs.MainDialog)

        this.addDialog(new WaterfallDialog(
                Dialogs.MainWaterfall, [this.contextAnalyzer.bind(this)]
            ))

        this.initialDialogId = Dialogs.MainWaterfall
    }

    private async contextAnalyzer(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        await stepContext.context.sendActivity(`Echo: ${stepContext.context.activity.text}`)
        return stepContext.endDialog()
    }

    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet: DialogSet = new DialogSet(accessor)
        dialogSet.add(this)

        const dialogContext: DialogContext = await dialogSet.createContext(context)
        const results: DialogTurnResult<any> = await dialogContext.continueDialog()

        if (results.status === DialogTurnStatus.empty)
            await dialogContext.beginDialog(this.id)
    }
}
