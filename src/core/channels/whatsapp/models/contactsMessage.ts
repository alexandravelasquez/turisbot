import { IsArray, IsObject, IsOptional, IsString, IsUrl } from "class-validator"
import { Url } from "url"

class Address {
    @IsString()
    street: string

    @IsString()
    city: string

    @IsString()
    state: string

    @IsString()
    zip: string

    @IsString()
    country: string

    @IsString()
    country_code: string

    @IsString()
    type: string
}

class Email {
    @IsString()
    email: string

    @IsString()
    type: string
}

class Name {
    @IsString()
    formatted_name: string

    @IsString()
    first_name: string

    @IsString()
    @IsOptional()
    last_name: string

    @IsString()
    @IsOptional()
    middle_name: string

    @IsString()
    @IsOptional()
    suffix: string

    @IsString()
    @IsOptional()
    prefix: string
}

class Org {
    @IsString()
    company: string

    @IsString()
    department: string

    @IsString()
    title: string
}

class Phone {
    @IsString()
    phone: string

    @IsString()
    wa_id: string

    @IsString()
    type: string
}

class UrlContact {
    @IsUrl()
    url: Url

    @IsString()
    type: string
}

export class ContactsMessage {
    @IsArray()
    @IsOptional()
    addresses: Address[]

    @IsString()
    @IsOptional()
    birthday: string

    @IsArray()
    @IsOptional()
    emails: Email[]

    @IsObject()
    name: Name

    @IsObject()
    @IsOptional()
    org: Org

    @IsArray()
    phones: Phone[]

    @IsArray()
    @IsOptional()
    urls: UrlContact[]
}