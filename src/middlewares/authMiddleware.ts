import { SecurePass } from 'argon2-pass'
import { NextFunction, Request, Response } from 'express'

import { UsersService } from '@services/userService'

export class AuthMiddleware {
  // eslint-disable-next-line no-use-before-define
  private static instance: AuthMiddleware

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware()
    }
    return AuthMiddleware.instance
  }

  public async validateBodyRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    if (req.body && req.body.email && req.body.password) {
      next()
    } else {
      res.status(400).send({ error: 'Missing body fields: email, password' })
    }
  }

  // eslint-disable-next-line consistent-return
  public async verifyUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userService = UsersService.getInstance()
    const user: any = await userService.getByEmail(req.body.email)

    if (user) {
      const passwordHash = user.password
      const sp = new SecurePass()
      const passwordBuffer = Buffer.from(passwordHash, 'utf8')
      const requestPassword = Buffer.from(req.body.password, 'utf8')
      const result = await sp.verifyHash(requestPassword, passwordBuffer)

      if (SecurePass.isValid(result)) {
        req.body = {
          userId: user.id,
          email: user.email,
          provider: 'email',
          permissionLevel: user.permissionLevel,
        }
        return next()
      }
      res.status(400).send({ errors: 'Invalid e-mail and/or password' })
    }
    res.status(400).send({ errors: 'Invalid e-mail and/or password' })
  }
}
