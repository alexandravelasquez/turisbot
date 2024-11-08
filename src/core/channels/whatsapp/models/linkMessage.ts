import { IsUrl } from "class-validator"

export class LinkMessage {
    @IsUrl()
    link: string
}