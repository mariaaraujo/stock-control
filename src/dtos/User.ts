export interface User extends UserDTO {
  id: string
}

export interface UserDTO {
  name: string
  email: string
  password: string
  role: string
}

export interface UserUpdateDTO {
  email: string
  password?: string
  name: string
  role: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  role: string
}
