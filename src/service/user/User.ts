import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import { ResponseDTO, User, UserDTO, UserResponse, UserUpdateDTO } from '@/dtos'
import { database } from '@/config'

interface UserInterface {
  create: (userDTO: UserDTO) => Promise<ResponseDTO>
  update: (userId: string, userUpdateDTO: UserUpdateDTO) => Promise<ResponseDTO>
  delete(userId: string): Promise<ResponseDTO>

  getByEmail: (login: string) => Promise<UserResponse | null>
  getById: (id: string) => Promise<UserResponse | null>
  get: (
    skip: number,
    limit: number,
    filter?: { name?: string },
    orderBy?: any,
  ) => Promise<ResponseDTO>
}

export class UserService implements UserInterface {
  public async create(userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      const alreadyRegistered = await this.getByEmail(userDTO.login)

      if (alreadyRegistered) {
        console.error(
          `User with login ${userDTO.login} is already registered to create user.`,
        )

        return {
          status: 400,
          message: {
            error: `User with login ${userDTO.login} is already registered to create user.`,
          },
        }
      }

      userDTO.password = await this.hashPassword(userDTO.password)

      const insertUser = await database.collection('user').insertOne(userDTO)

      return { status: 200, message: insertUser?.insertedId?.toHexString() }
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
        password: userCursor.password,
      }
    } catch (error) {
      console.error(
        `Error to check if user is already registered with login ${login}.`,
        error,
      )
      return null
    }
  }

  public async getById(userId: string): Promise<UserResponse | null> {
    try {
      const userCursor = await database.collection('user').findOne({
        _id: new ObjectId(userId),
      })

      if (!userCursor) {
        console.error(`User ${userId} not found`)
        return null
      }

      return {
        id: userCursor?._id.toHexString(),
        login: userCursor?.login,
        name: userCursor?.name,
        role: userCursor?.role,
      }
    } catch (error) {
      console.error(
        `Error to check if user is already registered with id ${userId}.`,
        error,
      )
      return null
    }
  }

  public async update(
    userId: string,
    userUpdateDTO: UserUpdateDTO,
  ): Promise<ResponseDTO> {
    try {
      const user = await this.getById(userId)

      if (!user) {
        return this.handleError(
          `Error to update user ${userId}: User not found`,
        )
      }

      if (userUpdateDTO.login !== user.login) {
        const alreadyExists = await this.getByEmail(userUpdateDTO.login)

        if (alreadyExists) {
          return this.handleError(
            `Error to update user ${userId}: Email ${userUpdateDTO.login} already in use`,
          )
        }
      }

      const userResponse: UserResponse = {
        id: userId,
        login: userUpdateDTO.login,
        name: userUpdateDTO.name,
        role: userUpdateDTO?.role,
      }

      if (userUpdateDTO.password) {
        userUpdateDTO.password = await this.hashPassword(userUpdateDTO.password)

        await database.collection('user').updateOne(
          {
            _id: new ObjectId(userId),
          },
          {
            $set: {
              name: userUpdateDTO.name,
              login: userUpdateDTO.login,
              role: userUpdateDTO.role,
              password: userUpdateDTO.password,
            },
          },
        )

        return { status: 200, message: userResponse }
      }

      await database.collection('user').updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: {
            name: userUpdateDTO.name,
            login: userUpdateDTO.login,
            role: userUpdateDTO.role,
          },
        },
      )

      return { status: 200, message: userResponse }
    } catch (e) {
      console.error(`Error to update user ${userId}: `, e)
      return {
        status: 400,
        message: {
          error: `Error to update user ${userId}: ` + e,
        },
      }
    }
  }

  public async delete(userId: string): Promise<ResponseDTO> {
    try {
      const user = await this.getById(userId)

      if (!user) {
        return this.handleError(
          `Error to delete user ${userId}: User not found`,
        )
      }

      await database.collection('user').deleteOne({
        _id: new ObjectId(userId),
      })

      return { status: 200, message: `User ${userId} deleted` }
    } catch (e) {
      console.error(`Error to delete user ${userId}: `, e)
      return {
        status: 400,
        message: {
          error: `Error to delete user ${userId}: ` + e,
        },
      }
    }
  }

  public async get(
    pageNumber: number = 0,
    pageSize: number = 20,
    filter?: { name?: string },
    orderBy?: any,
  ): Promise<ResponseDTO> {
    try {
      const usersResponse = await database
        .collection('user')
        .find(filter!)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(orderBy ?? {})
        .toArray()

      const users: UserResponse[] = []

      for (const userResponse of usersResponse) {
        const user: UserResponse = {
          id: userResponse._id.toHexString(),
          login: userResponse.login,
          name: userResponse.name,
          role: userResponse.role,
        }

        users.push(user)
      }

      return { status: 200, message: { total: users.length, users: users } }
    } catch (e) {
      console.error('Error to get users: ', e)
      return { status: 400, message: { error: 'Error to get users: ' + e } }
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
