import { IsArray, IsObject, IsOptional, IsString, MaxLength } from "class-validator"

class Header {
    @IsString()
    type: string

    @IsString()
    text: string
}

class Text {
    @IsString()
    text: string
}

class Row {
    @IsString()
    id: string

    @IsString()
    @MaxLength(24)
    title: string

    @IsString()
    description: Text
}

class Section {
    @IsString()
    @IsOptional()
    title?: string

    @IsArray()
    rows: Row[]
}

class Action {
    @IsString()
    button: string

    @IsArray()
    sections: Section[]
}

export class ListMessage {
    @IsString()
    type: string

    @IsObject()
    @IsOptional()
    header?: Header

    @IsObject()
    body: Text

    @IsObject()
    @IsOptional()
    footer: Text

    @IsObject()
    action: Action
}