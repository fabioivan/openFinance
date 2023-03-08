import { Request, Response, NextFunction } from 'express'

import { UsersService } from '@services/userService'

export class UsersMiddleware {
  // eslint-disable-next-line no-use-before-define
  private static instance: UsersMiddleware

  public static getInstance(): UsersMiddleware {
    if (!UsersMiddleware.instance) {
      UsersMiddleware.instance = new UsersMiddleware()
    }
    return UsersMiddleware.instance
  }

  public validateRequiredCreateUserBodyFields(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    if (req.body && req.body.email && req.body.password) {
      next()
    } else {
      res
        .status(404)
        .send({ error: 'Missing required fields email and password' })
    }
  }

  public async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const userService = UsersService.getInstance()
    const user = await userService.getByEmail(req.body.email)
    if (user) {
      res.status(400).send({ error: 'User email already exists' })
    } else {
      next()
    }
  }

  public async validateUserExists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const userService = UsersService.getInstance()
    const user = await userService.readById(req.params.userId)
    if (user) {
      next()
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found` })
    }
  }

  public async extractUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<string | void> {
    req.body.id = req.params.userId
    next()
  }
}
