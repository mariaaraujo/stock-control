import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import { ResponseDTO, UserDTO, UserResponse } from '@/dtos'
import { database } from '@/config'

interface UserInterface {
  create: (userDTO: UserDTO) => Promise<ResponseDTO>
  // update: (userId: string, userUpdateDTO: UserUpdateDTO) => Promise<ResponseDTO>
  getByEmail: (email: string) => Promise<UserResponse | null>
  // get: (
  //   skip: number,
  //   limit: number,
  //   filter?: any,
  //   orderBy?: any,
  // ) => Promise<User[]>
}

export class UserService implements UserInterface {
  public async create(userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      const alreadyRegistered = await this.getByEmail(userDTO.email)

      if (alreadyRegistered) {
        console.error(
          `Customer with document or email ${userDTO.email} is already registered to create customer.`,
        )

        return {
          status: 200,
          message: {
            error: `Customer with document or email ${userDTO.email} is already registered to create customer.`,
          },
        }
      }

      const hashedPassword = await this.hashPassword(userDTO.password)

      const user = await database.collection('user').insertOne({
        name: userDTO.name,
        email: userDTO.email,
        password: hashedPassword,
        role: userDTO.role,
      })

      return { status: 200, message: { id: user.insertedId } }
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

  public async getByEmail(email: string): Promise<UserResponse | null> {
    try {
      const userCursor = await database.collection('user').findOne({
        email: email,
      })

      if (!userCursor) {
        console.error(`User ${email} not found`)
        return null
      }

      return {
        id: userCursor._id.toHexString(),
        role: userCursor?.role,
        name: userCursor.name,
        email: userCursor.email,
      }
    } catch (error) {
      console.error(
        `Error to check if user is already registered with email ${email}.`,
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
}
