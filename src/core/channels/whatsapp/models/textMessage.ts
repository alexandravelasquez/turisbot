import { IsBoolean, IsString } from "class-validator"

export class TextMessage {
    @IsString()
    text: string

    @IsBoolean()
    preview_url: boolean
}