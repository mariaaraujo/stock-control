import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import { ResponseDTO, UserDTO, UserResponse } from '@/dtos'
import { database } from '@/config'

interface UserInterface {
  login: (userDTO: UserDTO) => Promise<ResponseDTO>

  getByEmail: (login: string) => Promise<UserResponse | null>
}

export class UserService implements UserInterface {
  public async login(userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      const userExists = await this.getByEmail(userDTO.login)

      if (!userExists) {
        console.error(`User with login ${userDTO.login} doesn't exists.`)

        return {
          status: 400,
          message: {
            error: `User with login ${userDTO.login} doesn't exists.`,
          },
        }
      }

      const hashedPassword = await this.hashPassword(userDTO.password)

      const user = await database.collection('user').findOne({
        login: userDTO.login,
        password: hashedPassword,
      })

      return { status: 200, message: { id: user?._id } }
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

  public async getByEmail(login: string): Promise<UserResponse | null> {
    try {
      const userCursor = await database.collection('user').findOne({
        login: login,
      })

      if (!userCursor) {
        console.error(`User ${login} not found`)
        return null
      }

      return {
        id: userCursor._id.toHexString(),
        role: userCursor?.role,
        name: userCursor.name,
        login: userCursor.login,
      }
    } catch (error) {
      console.error(
        `Error to check if user is already registered with login ${login}.`,
        error,
      )
      return null
    }
  }

  private async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)

    return await bcrypt.hash(password, salt)
  }

  private handleError(message: string, status: number = 400): ResponseDTO {
    console.error(message)
    return { status: status, message: message }
  }
}
