import { IsString } from "class-validator"

export class LocationMessage {
    @IsString()
    latitude: string

    @IsString()
    longitude: string

    @IsString()
    name: string

    @IsString()
    address: string
}