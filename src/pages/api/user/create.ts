import { UserService } from '@/service/user/User'
import type { NextApiRequest, NextApiResponse } from 'next'

const userService = new UserService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const userDTO = req.body

    try {
      const user = await userService.create(userDTO)

      return res.status(200).send(user)
    } catch (error) {
      console.error('Error to create User: ', JSON.stringify(error))

      return res.status(400).send({
        error: 'Error to create User: ' + error,
      })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
