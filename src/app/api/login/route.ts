import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { BcryptAdapter } from '@/service/cryptography/BCryptAdapter'
import { AuthenticationService } from '@/service/user/Authentication'

const bcryptAdapter = new BcryptAdapter(12)
const authenticationService = new AuthenticationService(bcryptAdapter)

export const POST = async (req: NextRequest, res: NextResponse) => {
  const userLogin = await req.json()

  try {
    const login = await authenticationService.login(userLogin)
    if (login?.message) {
      const d = new Date()
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000)

      cookies().set('stock-userId', login?.message?.id, {
        expires: d,
      })

      cookies().set('stock-userName', login?.message?.name, {
        expires: d,
      })

      cookies().set('stock-userRole', login?.message?.role, {
        expires: d,
      })
    }

    return NextResponse.json(login, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error to login: ' + error },
      { status: 400 },
    )
  }
}
