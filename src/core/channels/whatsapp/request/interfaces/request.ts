import {
    ContactsMessage,
    LocationMessage,
    ListMessage,
    RepliesMessage
} from "../../models"

export interface MetaRequest {
    messaging_product: string
    recipient_type?: string
    to?: string
    type?: string
    text?: {
        body: string
    }
    preview_url?: boolean
    image?: {
        link: string
    }
    audio?: {
        link: string
    }
    document?: {
        link: string
        filename: string
        caption?: string
    }
    sticker?: {
        link: string
    }
    video?: {
        link: string
        caption?: string
    }
    contacts?: ContactsMessage[]
    location?: LocationMessage
    status?: string
    message_id?: string
    interactive?: ListMessage | RepliesMessage
}