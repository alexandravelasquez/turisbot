import { IsOptional, IsString, IsUrl } from "class-validator"

export class VideoMessage {
    @IsUrl()
    link: string

    @IsString()
    @IsOptional()
    caption: string
}