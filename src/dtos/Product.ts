export interface Product extends ProductDTO {
  id: string
}

export interface ProductDTO {
  name: string
  price: number
  quantity: number
}

export interface ProductResponse {
  id: string
  name: string
  price: number
  quantity: number
}
