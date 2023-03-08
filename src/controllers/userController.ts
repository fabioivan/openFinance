import { Request, Response } from 'express'

import { CommonPermissionMiddleware } from '@common/middlewares/permissionMiddleware'
import { UsersService } from '@services/userService'
import { removeSecuredFields, generateSecurePassword } from '@utils/index'
import { UsersRepository } from '@repositories/userRepository';

export class UsersController {

  private static _userRepository = new UsersRepository()

  public async listUsers(req: Request, res: Response) {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    const users = await usersService.list(100, 0)
    const updatedUsers = users.map(removeSecuredFields)
    res.status(200).send(updatedUsers)
  }

  public async getUserById(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    const user = await usersService.readById(req.params.userId)
    if (user !== null) res.status(200).send(removeSecuredFields(user))

    res.status(500).send('Nenhum registro encontrado')
  }

  public async createUser(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    const password = Buffer.from(req.body.password)
    req.body.password = await generateSecurePassword(password)
    req.body.permissionLevel = CommonPermissionMiddleware.BASIC_PERMISSION
    const userId = await usersService.create(req.body)
    res.status(201).send({ id: userId })
  }

  public async patch(req: Request, res: Response): Promise<Response | void> {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    await usersService.patchById(req.body)
    res.status(204).send('')
  }

  public async put(req: Request, res: Response): Promise<Response | void> {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    await usersService.updateById(req.body)
    res.status(204).send('Registro alterado com sucesso')
  }

  public async removeUser(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const usersService = UsersService.getInstance(
      UsersController._userRepository
    )
    await usersService.deleteById(req.params.userId)
    res.status(204).send('Registro deletado com sucesso!')
  }
}
