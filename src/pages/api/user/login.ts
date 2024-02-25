import { BcryptAdapter } from '@/service/cryptography/BCryptAdapter'
import { AuthenticationService } from '@/service/user/Authentication'
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'

const bcryptAdapter = new BcryptAdapter(12)
const authenticationService = new AuthenticationService(bcryptAdapter)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const userLogin = req.body

    try {
      const login = await authenticationService.login(userLogin)

      return res.status(200).send(login)
    } catch (error) {
      console.error('Error to login: ', JSON.stringify(error))

      return res.status(400).send({
        error: 'Error to login: ' + error,
      })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
