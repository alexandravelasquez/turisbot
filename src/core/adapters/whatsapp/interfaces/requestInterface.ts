export interface RequestInterface {
    _object: string
    entry: Entry[]
}

interface Entry {
    id: string
    changes: Change[]
}

interface Change {
    value: Value
    field: string
}

interface Value {
    messaging_product: string
    metadata: Metadata
    contacts: Contact[]
    messages: Message[]
    statuses: Status[]
}

interface Metadata {
    display_phone_number: string
    phone_number_id: string
}

interface Contact {
    profile: Profile
    wa_id: string
}

interface Profile {
    name: string
}

interface Message {
    context: Context
    from: string
    id: string
    timestamp: string
    text: Text
    type: string
    interactive: Interactive
    reaction: Reaction
}

interface Context {
    from: string
    id: string
}

interface Status {
    id: string
    status: string
    timestamp: string
    recipient_id: string
    conversation: Conversation
    pricing: Pricing
}

interface Conversation {
    id: string
    expiration_timestamp: string
    origin: Origin
}

interface Origin {
    type: string
}

interface Pricing {
    billable: string
    pricing_model: string
    category: string
}

interface Text {
    body: string
}

interface Interactive {
    type: string
    button_reply: Button_Reply
}

interface Button_Reply {
    id: string
    title: string
}

interface Reaction {
    message_id: string
    emoji: string
}
