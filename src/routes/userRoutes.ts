import { Application } from 'express'

import { CommonPermissionMiddleware, CommonRoutes } from '@common/index'
import { UsersController } from '@controllers/userController'
import { UsersMiddleware, JwtMiddleware } from '@middlewares/index'

export class UserRoutes extends CommonRoutes {
  public constructor(app: Application) {
    super(app, 'UserRoute')
  }

  protected configureRoutes(): void {
    const usersController = new UsersController()
    const usersMiddleware = UsersMiddleware.getInstance()
    const jwtMiddleware = JwtMiddleware.getInstance()
    const commonPermissionMiddleware = new CommonPermissionMiddleware()
    this.app
      .route('/users')
      .get([
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlyAdminCanDoThisAction,
        usersController.listUsers,
      ])
      .post([
        usersMiddleware.validateRequiredCreateUserBodyFields,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser,
      ])

    this.app
      .route('/users/:userId')
      .put([
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        usersMiddleware.validateUserExists,
        usersMiddleware.extractUserId,
        usersController.put,
      ])
      .patch([
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        usersMiddleware.validateUserExists,
        usersMiddleware.extractUserId,
        usersController.patch,
      ])
      .delete([
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        usersMiddleware.validateUserExists,
        usersMiddleware.extractUserId,
        usersController.removeUser,
      ])
      .get([
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        usersMiddleware.validateUserExists,
        usersMiddleware.extractUserId,
        usersController.getUserById,
      ])
  }
}
