export interface ResponseDTO {
  status: number
  message: any | ResponseMessageDTO
}

interface ResponseMessageDTO {
  error: any
}
