import { Document } from 'mongoose'

import { ICRUD } from '@common/interfaces/iCrud'
import { UsersRepository } from '@repositories/userRepository'

export class UsersService implements ICRUD {
  // eslint-disable-next-line no-use-before-define
  private static instance: UsersService

  private static _repository: UsersRepository

  protected constructor(repository: UsersRepository) {
    UsersService._repository = repository
  }

  public static getInstance(repository: UsersRepository): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService(repository)
    }
    return UsersService.instance
  }

  public create(resource: any) {
    return UsersService._repository.addUser(resource)
  }

  public deleteById(resourceId: any) {
    return UsersService._repository.removeUserById(resourceId)
  }

  public list(limit: number, page: number) {
    return UsersService._repository.listUsers(limit, page)
  }

  public patchById(resource: any) {
    return UsersService._repository.patchUser(resource)
  }

  public readById(
    resourceId: any
  ): Promise<Document<any, any, any | null> | null> {
    return UsersService._repository.getUserById(resourceId)
  }

  public updateById(resource: any) {
    return UsersService._repository.patchUser(resource)
  }

  public async getByEmail(email: string) {
    return UsersService._repository.getUserByEmail(email)
  }
}
