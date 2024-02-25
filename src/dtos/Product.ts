export interface Product extends ProductDTO {
  id: string
}

export interface ProductDTO {
  name: string
  price: number
  quantity: number
  userId: string
}

export interface ProductResponse {
  id: string
  name: string
  price: number
  quantity: number
  createdAt: Date
  userId: string
}
