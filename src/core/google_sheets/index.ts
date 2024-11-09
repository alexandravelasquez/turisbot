import { ConfigService } from "@nestjs/config"
import { firstValueFrom } from "rxjs"
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios"

export class GoogleSheets {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }

    async Save(schedule: any) {
        const regex = /\{.*\}/s;
        const match = schedule.match(regex);
        const jsonString = match[0].trim()

        const json = JSON.parse(jsonString)

        const body = {
            Fecha: json.date,
            DNI: json.dni,
            Cliente: json.name,
            Cumpleaños: json.birthday,
            Personas: json.people,
            FechaViaje: json.date,
            Detalle: json.detail
        }

        let { data }: AxiosResponse<any> = await firstValueFrom(
            this.httpService.post(`https://api.sheetbest.com/sheets/${this.configService.get("GoogleSheetsId")}`, body)
        )

        return data
    }
}