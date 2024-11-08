import { IsOptional, IsString, IsUrl } from "class-validator"

export class DocumentMessage {
    @IsUrl()
    link: string

    @IsString()
    filename: string

    @IsString()
    @IsOptional()
    caption: string
}