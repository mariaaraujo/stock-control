import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AuthenticationService } from '@/service/user/Authentication'

const authenticationService = new AuthenticationService()

export const POST = async (req: NextRequest, res: NextResponse) => {
  const userLogin = await req.json()

  try {
    const login = await authenticationService.login(userLogin)
    if (typeof login?.message === 'object') {
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
