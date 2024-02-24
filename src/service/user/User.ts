import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

import { ResponseDTO, User, UserDTO, UserResponse, UserUpdateDTO } from '@/dtos'
import { database } from '@/config'

interface UserInterface {
  create: (userDTO: UserDTO) => Promise<ResponseDTO>
  update: (userId: string, userUpdateDTO: UserUpdateDTO) => Promise<ResponseDTO>
  delete(userId: string): Promise<ResponseDTO>

  getByEmail: (email: string) => Promise<UserResponse | null>
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
      const alreadyRegistered = await this.getByEmail(userDTO.email)

      if (alreadyRegistered) {
        console.error(
          `Customer with document or email ${userDTO.email} is already registered to create customer.`,
        )

        return {
          status: 400,
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
        email: userCursor?.email,
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

      if (userUpdateDTO.email !== user.email) {
        const alreadyExists = await this.getByEmail(userUpdateDTO.email)

        if (alreadyExists) {
          return this.handleError(
            `Error to update user ${userId}: Email ${userUpdateDTO.email} already in use`,
          )
        }
      }

      const userResponse: UserResponse = {
        id: userId,
        email: userUpdateDTO.email,
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
              email: userUpdateDTO.email,
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
            email: userUpdateDTO.email,
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
          `Error to update user ${userId}: User not found`,
        )
      }

      await database.collection('user').deleteOne({
        _id: new ObjectId(userId),
      })

      return { status: 200, message: `User ${userId} deleted` }
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
          email: userResponse.email,
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
