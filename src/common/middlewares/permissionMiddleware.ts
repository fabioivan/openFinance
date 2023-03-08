import { Response } from 'express'

export class CommonPermissionMiddleware {
  public static MAX_PERMISSION = 4096 * 2

  public static BASIC_PERMISSION = 1

  public minimumPermissionLevelRequired(requiredPermissionLevel: any) {
    return (req: any, res: any, next: any) => {
      try {
        const userPermissionLevel = parseInt(req.jwt.permissionLevel, 10)
        if (
          // eslint-disable-next-line no-bitwise
          userPermissionLevel & Number.parseInt(requiredPermissionLevel, 10)
        ) {
          next()
        } else {
          res.status(403).send({})
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  public async onlySameUserOrAdminCanDoThisAction(
    req: any,
    res: any,
    next: any
  ): Promise<Response> {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel, 10)
    const { userId } = req.jwt
    if (req.params && req.params.userId && userId === req.params.userId) {
      return next()
    }
    // eslint-disable-next-line no-bitwise
    if (userPermissionLevel & CommonPermissionMiddleware.MAX_PERMISSION) {
      return next()
    }
    return res.status(403).send({})
  }

  public async onlyAdminCanDoThisAction(
    req: any,
    res: any,
    next: any
  ): Promise<Response> {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel, 10)
    // eslint-disable-next-line no-bitwise
    if (userPermissionLevel & CommonPermissionMiddleware.MAX_PERMISSION) {
      return next()
    }
    return res.status(403).send({})
  }
}
