import { ResponseDTO, UserLogin } from '@/dtos'

import { UserService } from './User'
import { database } from '@/config'

interface AuthenticationInterface {
  login: (userLogin: UserLogin) => Promise<ResponseDTO>
}

export class AuthenticationService implements AuthenticationInterface {
  private readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public async login(userLogin: UserLogin): Promise<ResponseDTO> {
    try {
      const userExists = await this.userService.getByEmail(userLogin.login)

      if (!userExists) {
        console.error(`User with login ${userLogin.login} doesn't exists.`)

        return {
          status: 400,
          message: {
            error: `User with login ${userLogin.login} doesn't exists.`,
          },
        }
      }

      const isPasswordValid = await database.collection('user').findOne({
        login: userLogin?.login,
        password: userLogin?.password,
      })

      if (!isPasswordValid) {
        console.error(`Wrong Password.`)

        return {
          status: 400,
          message: {
            error: `Wrong Password.`,
          },
        }
      }

      const userReturn = {
        id: userExists?.id,
        name: userExists?.name,
        role: userExists?.role,
      }

      return { status: 200, message: userReturn }
    } catch (error) {
      console.error('Error to create user: ', error)

      return {
        status: 400,
        message: {
          error: 'Error to create user: ' + error,
        },
      }
    }
  }
}
