import { UserService } from '@/service/user/User'
import type { NextApiRequest, NextApiResponse } from 'next'

const userService = new UserService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const page = req.query.page?.toString()
    const pageSize = req.query.pageSize?.toString()
    const filter = req.query.filter?.toString()
    const orderBy = req.query.orderBy?.toString()
    const encryptedToken = req.headers.authorization

    const params = {
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      filter: filter ? JSON.parse(filter) : {},
      orderBy: orderBy ? JSON.parse(orderBy) : {},
    }

    try {
      const users = await userService.get(
        params?.page,
        params?.pageSize,
        params?.filter,
        params?.orderBy,
      )

      return res.status(200).send(users)
    } catch (e) {
      console.error('Error to get users: ', JSON.stringify(e))
      return res.status(400).send({ error: 'Error to get users : ' + e })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
