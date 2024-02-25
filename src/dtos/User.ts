export interface User extends UserDTO {
  id: string
}

export interface UserDTO {
  name: string
  login: string
  password: string
  role: string
}

export interface UserUpdateDTO {
  login: string
  password?: string
  name: string
  role: string
}

export interface UserResponse {
  id: string
  login: string
  name: string
  role: string
  password?: string
}

export interface UserLogin {
  login: string
  password: string
}
