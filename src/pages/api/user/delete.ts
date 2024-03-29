import { UserService } from '@/service/user/User'
import type { NextApiRequest, NextApiResponse } from 'next'

const userService = new UserService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const userId = req.query.id?.toString()

    if (!userId) {
      console.error('Error to delete User: Missing userId')
      return res.status(400).send({
        error: 'Error to delete User: Missing userId',
      })
    }

    try {
      const user = await userService.delete(userId)

      return res.status(200).send(user)
    } catch (error) {
      console.error(`Error to delete User ${userId}: `, JSON.stringify(error))
      return res
        .status(400)
        .send({ error: `Error to delete User ${userId}: ` + error })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
