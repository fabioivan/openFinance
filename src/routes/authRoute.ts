import { Application } from 'express'

import { CommonRoutes } from '@common/routesConfig'
import { AuthController } from '@controllers/authController'
import { AuthMiddleware } from '@middlewares/authMiddleware'
import { JwtMiddleware } from '@middlewares/jwtMiddleware'

export class AuthRoutes extends CommonRoutes {
  public constructor(app: Application) {
    super(app, 'AuthenticationRoute')
  }

  protected configureRoutes(): void {
    const usersController = new AuthController()
    const authMiddleware = AuthMiddleware.getInstance()
    const jwtMiddleware = JwtMiddleware.getInstance()
    this.app.post('/auth', [
      authMiddleware.validateBodyRequest,
      authMiddleware.verifyUserPassword,
      usersController.createJWT,
    ])
    this.app.post('/auth/refresh-token', [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      usersController.createJWT,
    ])
  }
}
