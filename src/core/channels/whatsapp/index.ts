import { HttpService } from "@nestjs/axios"
import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common"
import { AxiosError, AxiosResponse } from "axios"
import { catchError, firstValueFrom } from "rxjs"
import { Webhook } from "./interfaces/webhook"
import { ErrorInterface } from "./interfaces/error"
import { MetaResponse } from "../../adapters/whatsapp/interfaces/metaResponse"
import {
    ContactsMessage,
    DocumentMessage,
    LinkMessage,
    ListMessage,
    LocationMessage,
    RepliesMessage,
    TextMessage,
    VideoMessage
} from "./models"
import { ConfigService } from "@nestjs/config"
import { HmacSHA256 } from "crypto-js"
import { MetaRequest } from "./request/interfaces/request"
import { PayloadTypes } from "./request/payloadTypes"
import { MetaMessageTypes } from "./models/metaMessageTypes"
import { MetaService } from "./request"

export class WhatsAppExternalService {
    private metaRequest: MetaRequest
    
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly metaService: MetaService) { }

    async verifyWebhook(query: Webhook): Promise<string> {
        if (!query['hub.mode'] || !query['hub.verify_token'] || !query['hub.challenge'])
            throw new BadRequestException("Verifique los query parameters.")

        if (query['hub.mode'] !== "subscribe")
            throw new BadRequestException("El query hub.mode no es el correcto.")

        if (query['hub.verify_token'] !== this.configService.get("WHATSAPP_WEBHOOK_TOKEN"))
            throw new ForbiddenException("El token es incorrecto.")

        return query['hub.challenge']
    }

    async verifySignature(signature: string, body: any): Promise<string> {
        if (!signature)
            throw new BadRequestException("El header x-hub-signature-256 es requerido.")

        if (!signature.startsWith("sha256="))
            throw new BadRequestException("El header x-hub-signature-256 no tiene el formato correcto.")

        if (!body?.entry?.[0]?.changes?.[0]?.value?.messages)
            throw new BadRequestException("El cuerpo del request no puede estar vacío.")

        var encoded = `sha256=${HmacSHA256(body, this.configService.get<string>("META_APP_TOKEN"))}`
        if (encoded !== signature)
            throw new ForbiddenException("El header x-hub-signature-256 es incorrecto.")

        return "Verificación de signature exitosa."
    }

    //#region SendMessage
    async sendTextMessage(to: string, body: TextMessage): Promise<MetaResponse> {
        this.metaRequest = {
            messaging_product: PayloadTypes.MESSAGING_PRODUCT,
            recipient_type: PayloadTypes.INDIVIDUAL,
            to: to,
            type: MetaMessageTypes.TEXT,
            text: {
                body: body.text
            },
            preview_url: body.preview_url
        }

        return await this.metaService.sendToMetaService(this.metaRequest)
    }

    async sendImageMessage(to: string, body: LinkMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/image`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendAudioMessage(to: string, body: LinkMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/audio`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendStickerMessage(to: string, body: LinkMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/sticker`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendDocumentMessage(to: string, body: DocumentMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/document`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendVideoMessage(to: string, body: VideoMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/video`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendContactsMessage(to: string, body: ContactsMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/contacts`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendLocationMessage(to: string, body: LocationMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/location`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendListMessage(to: string, body: ListMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/list`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }

    async sendRepliesMessage(to: string, body: RepliesMessage): Promise<MetaResponse> {
        let { data }: AxiosResponse<MetaResponse> = await firstValueFrom(
            this.httpService.post(`https://wspapi.vercel.app/api/send-message/${to}/replies`, body).pipe(
                catchError((axiosError: AxiosError) => {
                    let errorResponse = axiosError.response.data as ErrorInterface
                    throw this.handleException(axiosError.response.status, errorResponse.message)
                })
            )
        )

        return data
    }
    //#endregion

    private handleException(statusCode: number, error: string): AxiosError {
        if (statusCode == 400)
            throw new BadRequestException(error)
        if (statusCode == 401)
            throw new UnauthorizedException(error)
        if (statusCode == 403)
            throw new ForbiddenException(error)
        if (statusCode == 404)
            throw new NotFoundException(error)

        throw new InternalServerErrorException(error)
    }
}