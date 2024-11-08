export interface MetaErrorResponse {
    error: {
        message: string
        type: string,
        code: number,
        error_subcode?: number,
        error_data?: {
            messaging_product: string,
            details: string
        },
        fbtrace_id: string
    }
}
