import { HttpService } from "@nestjs/axios"
import { AxiosError, AxiosResponse } from "axios"
import { MetaRequest } from "./interfaces/request"
import { MetaResponse } from "./interfaces/response"
import { catchError, firstValueFrom } from "rxjs"
import { MetaErrorResponse } from "./interfaces/error"
import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export class MetaService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService) { }

    async sendToMetaService(metaRequest: MetaRequest): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`${this.configService.get("META_SERVICE_URL")}/${this.configService.get("META_SERVICE_VERSION")}/${this.configService.get("WHATSAPP_BUSINESS_PHONE")}/messages`, metaRequest, {
                headers: {
                    Authorization: `Bearer ${this.configService.get("WHATSAPP_BUSINESS_TOKEN")}`
                }
            })
                .pipe(
                    catchError((axiosError: AxiosError) => {
                        console.log(axiosError)
                        let errorResponse = axiosError.response.data as MetaErrorResponse
                        const error = errorResponse.error?.error_data?.details ? errorResponse.error.error_data.details : errorResponse.error.message
                        throw this.getException(axiosError.response.status, error)
                    })
                )
        )

        return data
    }

    getException(statusCode: number, error: string): AxiosError {
        if (statusCode == 400)
            throw new BadRequestException(error)
        if (statusCode == 401)
            throw new UnauthorizedException(error)
        if (statusCode == 403)
            throw new ForbiddenException(error)

        throw new InternalServerErrorException(error)
    }
}
