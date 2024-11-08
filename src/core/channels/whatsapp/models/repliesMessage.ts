import { IsArray, IsObject, IsOptional, IsString, Max } from "class-validator"
import { LinkMessage } from "./linkMessage"
import { DocumentMessage } from "./documentMessage"

class Text {
    @IsString()
    text: string
}

class Reply {
    @IsString()
    id: string

    @IsString()
    title: string
}

class Button {
    @IsString()
    type: string

    @IsObject()
    reply: Reply
}

class Buttons {
    @IsArray()
    @Max(3)
    buttons: Button[]
}

class Header {
    @IsString()
    type: string

    @IsString()
    text?: string

    @IsObject()
    image?: LinkMessage

    @IsObject()
    video?: LinkMessage

    @IsObject()
    document?: DocumentMessage
}

export class RepliesMessage {
    @IsString()
    type: string

    @IsObject()
    @IsOptional()
    header?: Header

    @IsObject()
    body: Text

    @IsObject()
    action: Buttons
}